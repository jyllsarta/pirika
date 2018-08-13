Rails.application.routes.draw do
  get 'pirika_console/index'
  get 'pirika_console/',  to: "pirika_console#index"
  post 'pirika_console/',  to: "pirika_console#update"

  root 'static_pages#index'
  get 'index/',       to: "static_pages#index"
  get 'samusugi/',    to: "static_pages#samusugi"
  get 'works/',       to: "static_pages#works"
  get 'contact/',     to: "static_pages#contact"
  get 'illusts/',     to: "static_pages#illusts"
  get 'sainokawara/', to: "static_pages#sainokawara"
  get 'neko/',        to: "static_pages#neko"
  get 'nekomanual/',  to: "static_pages#nekomanual"
  get 'neko2/',       to: "static_pages#neko2"
  get 'touzoku/',     to: "static_pages#touzoku"
  get 'twitter_webhook/',  to: "static_pages#twitter_webhook"


  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
