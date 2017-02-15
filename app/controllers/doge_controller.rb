class DogeController < ApplicationController

  #GET root
  def index
    if session[:username] == nil then
      session[:username] = "doge " + Rails.application.config.users.to_s
      Rails.application.config.users = (Rails.application.config.users + 1) % 100000
    end
    if session[:color] == nil then
      session[:color] = "#" + SecureRandom.hex(3)
    end
    gon.username = session[:username];
    @tab_id = Rails.application.config.tab_id
    Rails.application.config.tab_id = (Rails.application.config.tab_id + 1) % 100000
  end

  # POST /woof
  def woof
    @deliverable_msg = params[:deliverable_msg]
    if params[:deliverable_msg].length > 1024 then
      @deliverable_msg = params[:deliverable_msg][0..1023]
    end
    @tab_id = params[:tab_id]
    @color = session[:color]
    @username = session[:username]
    PrivatePub.publish_to "/woof", deliverable_msg: @deliverable_msg,
	                                 username: @username,
				                           color: @color,
				                           tabid: @tab_id
  end

  # GET /doge_enqueue
  def doge_enqueue
    @account = Account.find_by_username(session[:username])
    if session[:logged_in] then
      QueueRequest.new(account_id: @account.id)
    else
      
    end
  end
end
