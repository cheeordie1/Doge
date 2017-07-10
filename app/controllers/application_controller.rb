class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  helper_method :current_user, :logged_in?, :token_cost

  def current_user
    @current_user ||= Account.find_by(id: session[:id])
  end

  def logged_in?
    current_user != nil
  end

  def token_cost
    return ActionController::Base.helpers.number_to_currency(Rails.application.config.cost_of_token)
  end

end
