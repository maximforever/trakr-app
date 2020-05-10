Rails.application.routes.draw do
  get 'auth/:provider/callback',  to: 'sessions#create'
  get 'logout',                   to: 'sessions#destroy'
  get 'session',                  to: 'sessions#show'

  namespace :api do
    namespace :v1 do
      

      get 'expenses',         to: 'expenses#index'
      post 'expenses',        to: 'expenses#create'
      delete 'expenses/:id',  to: 'expenses#destroy'

      get 'users/monthly-budget',   to: 'users#show_monthly_budget'
      post 'users/monthly-budget',   to: 'users#update_monthly_budget'
    end
  end
end
