require "stripe"
Stripe.api_key = Rails.application.credentials.stripe[:dev_secret]