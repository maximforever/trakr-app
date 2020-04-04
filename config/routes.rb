Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      get 'expenses',         to: 'expenses#index'
      post 'expenses',        to: 'expenses#create'
      delete 'expenses/:id',  to: 'expenses#destroy'
    end
  end
end
