Rails.application.routes.draw do
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  # root 'welcome#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end

  # Custom error pages
  get "/404", :to => "error#page_not_found"

  # home page
  root 'doge#index'

  # doge routes
  post "/woof" => "doge#woof"
  get  "/doge_enqueue" => "doge#doge_timer"
  post "/doge_enqueue" => "doge#doge_enqueue"
  get  "/doge_control" => "doge#doge_control"
  post "/doge_control" => "doge#doge_control_signal"
  get  "/doge_token_dropin" => "doge#doge_token_dropin"

  # account routes
  resources :accounts, only: [:new, :create, :update, :show]
  get  "/login" => "accounts#login"
  post "/login" => "accounts#post_login"
  get  "/logout" => "accounts#logout"
  get  "/color" => "accounts#color"
  post "/color" => "accounts#change_color"

  # purchase routes
  get "/purchase" => "purchase#buy_token"
  post "/purchase" => "purchase#post_buy_token"

  # test route
  get "/doge_purchase_test" => "doge#purchase"
end
