Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      get 'expenses/create'
      get 'expenses/index'
    end
  end
  namespace :api do
    namespace :v1 do
      get 'expenses', to: 'expenses#index'
      post 'expenses', to: 'expenses#create'
    end
  end
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
