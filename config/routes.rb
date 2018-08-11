Rails.application.routes.draw do
  get 'pirika_console/index'
  get 'pirika_console/',  to: "pirika_console#index"
  post 'pirika_console/',  to: "pirika_console#update"

  get 'static_pages/show'
  root 'static_pages#show'

  get 'neko/',  to: "static_pages#neko"
  get 'neko2/',  to: "static_pages#neko2"
  get 'nekomanual/',  to: "static_pages#nekomanual"
  get 'sainokawara/',  to: "static_pages#sainokawara"
  get 'samusugi/',  to: "static_pages#samusugi"
  get 'top/',  to: "static_pages#top"
  get 'touzoku/',  to: "static_pages#touzoku"
  get 'twitter_webhook/',  to: "static_pages#twitter_webhook"
  get 'works/',  to: "static_pages#works"


  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
