Rails.application.routes.draw do
  get 'pirika_console/index'
  get 'pirika_console/',  to: "pirika_console#index"

  get 'static_pages/show'
  root 'static_pages#show'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
