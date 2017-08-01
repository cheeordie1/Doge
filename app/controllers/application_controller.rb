class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  helper_method :current_user, :logged_in?, :token_cost, :get_currency, :get_kount_environment
  before_filter :assign_doge

  def current_user
    @current_user ||= Account.find_by(id: session[:id])
  end

  def logged_in?
    current_user != nil
  end

  # GET token
  # Generate a client token for Braintree
  def get_braintree_token
    if current_user then
      # Generate Braintree payment token for logged in users
      @client_token = Braintree::ClientToken.generate(customer_id: @current_user.customer_id)
      render json: {token: @client_token}
    else
      # Render an error for non logged in users
      render status: 401
    end
  end

  # GET /terms
  # HTML to display important terms of service agreement
  def terms_of_service
  end

  # GET /privacy
  # HTML to display important privacy policy
  def privacy_policy
  end

  def assign_doge
    if session[:username] == nil then
      session[:username] = "doge " + Rails.application.config.users.to_s
      Rails.application.config.users = (Rails.application.config.users + 1) % 100000
    end
    if session[:color] == nil then
      session[:color] = "#" + SecureRandom.hex(3)
    end
  end

  def get_kount_environment
    if Rails.env.production? then
      return "production"
    else
      return "sandbox"
    end
  end

  def token_cost
    return Rails.application.config.cost_of_token
  end

  def get_currency(amount)
    return ActionController::Base.helpers.number_to_currency(amount)
  end

end
