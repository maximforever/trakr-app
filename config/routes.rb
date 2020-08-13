Rails.application.routes.draw do
  get 'auth/:provider/callback',  to: 'sessions#create'
  get 'logout',                   to: 'sessions#destroy'
  get 'session',                  to: 'sessions#show'
  
  post '/stripe-webhook',         to: 'billing#stripe_webhook'
  post '/create-subscription',    to: 'billing#create_subscription'

  namespace :api do
    namespace :v1 do
      get     'expenses',       to: 'expenses#index'
      post    'expenses',       to: 'expenses#create'
      patch   'expenses',       to: 'expenses#update'
      delete  'expenses/:id',   to: 'expenses#destroy'

      get 'users/settings',   to: 'users#show_settings'
      post 'users/settings',   to: 'users#update_settings'
    end
  end
end
