Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      get 'users/monthly_budget'
    end
  end
  namespace :api do
    namespace :v1 do
      get 'expenses',         to: 'expenses#index'
      post 'expenses',        to: 'expenses#create'
      delete 'expenses/:id',  to: 'expenses#destroy'

      get 'users/monthly-budget',   to: 'users#monthly_budget'
    end
  end
end
