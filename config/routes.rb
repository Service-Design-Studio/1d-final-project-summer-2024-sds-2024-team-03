Rails.application.routes.draw do
  resources :logs
  resources :actionables
  #root to: redirect('/feedbacks')
  #root "feedbacks#index" #path with nothing

  root "analytics#index"
  # Define routes for Feedbacks
  resources :feedbacks
  
  resources :analytics do
    get 'get_earliest_latest_dates', on: :collection
    get 'filter_products', on: :collection
    get 'filter_sources', on: :collection
    get 'filter_subcategory', on: :collection
    get 'get_sentiment_scores', on: :collection
    get 'get_overall_sentiment_scores', on: :collection
    get 'get_sentiments_sorted', on: :collection
    get 'get_sentiments_distribution', on: :collection
    post 'uploads', on: :collection # Added upload action as a collection route
    
  end

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check
  

  # Defines the root path route ("/")
  # root "posts#index"
  
  # Redirect from root to /feedbacks

end