class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  helper_method :current_user, :logged_in?, :token_cost, :get_currency, :get_kount_environment

  def current_user
    @current_user ||= Account.find_by(id: session[:id])
  end

  def logged_in?
    current_user != nil
  end

  def get_kount_environment
    if Rails.Rails.env.production? then
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
