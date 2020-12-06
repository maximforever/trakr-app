class Billing::BillingsController < ApplicationController
  # TODO this is a super bloated controller - should refactor

  def pricing_options
    annual_pricing = Stripe::Price.list({lookup_keys: ['annual']}).data[0]
    monthly_pricing = Stripe::Price.list({lookup_keys: ['monthly']}).data[0]
    cards = Stripe::Customer.list_sources(current_user.stripe_id, {object: 'card'})

    render json:  {
      annual: {
        price: annual_pricing.unit_amount/100, 
        description: annual_pricing.metadata.description,
        type: annual_pricing.nickname, 
        id: annual_pricing.id
      }, 
      monthly: {
        price: monthly_pricing.unit_amount/100, 
        description: monthly_pricing.metadata.description,
        type: monthly_pricing.nickname, 
        id: monthly_pricing.id
      },
      cards: cards
    }
  end

  def create_subscription
    current_subscriptions = Stripe::Customer.retrieve(current_user.stripe_id).subscriptions

    if current_subscriptions['data'].length > 0
      current_plan = current_subscriptions['data'][0]['plan']['nickname']
      render json:  {
        status: "error",
        message: "You already have a subscription for the #{current_plan}"
      }

      return
    end

    begin 
      Stripe::PaymentMethod.attach(
        params['paymentMethodId'],
        { customer: params['customerId'] }
      )
    rescue Stripe::CardError => e
      halt 200,
           { 'Content-Type' => 'application/json' },
           { 'error': { message: e.error.message } }.to_json
    end

    # Set the default payment method on the customer
    Stripe::Customer.update(
      params['customerId'],
      invoice_settings: { default_payment_method: params['paymentMethodId'] }
    )

    # Create the subscription
    subscription =
      Stripe::Subscription.create(
        customer: params['customerId'],
        items: [{ price: params['priceId'] }],
        expand: %w[latest_invoice.payment_intent]
      )

    if subscription&.status == "active"
      current_user.subscription_status = "subscribed"
      current_user.save!
    end

    subscription.to_json
  end


  def stripe_webhook
    # You can use webhooks to receive information about asynchronous payment events.
    # For more about our webhook events check out https://stripe.com/docs/webhooks.
    payload = request.body.read
    if !Stripe.api_key.empty?
      # Retrieve the event by verifying the signature using the raw body and secret if webhook signing is configured.
      sig_header = request.env['HTTP_STRIPE_SIGNATURE']
      event = nil

      begin
        event =
          Stripe::Webhook.construct_event(payload, sig_header, Stripe.api_key)
      rescue JSON::ParserError => e
        # Invalid payload
        status 400
        return
      rescue Stripe::SignatureVerificationError => e
        # Invalid signature
        puts '⚠️  Webhook signature verification failed.'
        status 400
        return
      end
    else
      data = JSON.parse(payload, symbolize_names: true)
      event = Stripe::Event.construct_from(data)
    end
    # Get the type of webhook event sent - used to check the status of PaymentIntents.
    event_type = event['type']
    data = event['data']
    data_object = data['object']

    if event_type == 'invoice.paid'
      # Used to provision services after the trial has ended.
      # The status of the invoice will show up as paid. Store the status in your
      # database to reference when a user accesses your service to avoid hitting rate
      # limits.
      # puts data_object
    end

    if event_type == 'invoice.payment_failed'
      # If the payment fails or the customer does not have a valid payment method,
      # an invoice.payment_failed event is sent, the subscription becomes past_due.
      # Use this webhook to notify your user that their payment has
      # failed and to retrieve new card details.
      # puts data_object
    end

    if event_type == 'invoice.finalized'
      # If you want to manually send out invoices to your customers
      # or store them locally to reference to avoid hitting Stripe rate limits.
      # puts data_object
    end

    if event_type == 'customer.subscription.deleted'
      # handle subscription cancelled automatically based
      # upon your subscription settings. Or if the user cancels it.
      # puts data_object
    end

    if event_type == 'customer.subscription.trial_will_end'
      # Send notification to your user that the trial will end
      # puts data_object
    end

    content_type 'application/json'
    { status: 'success' }.to_json
  end
end