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
    determine_queue_content
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
  def doge_timer
    @timer_seconds = 60
    render "doge_enqueue"
  end

  # POST /doge_enqueue
  def doge_enqueue
    if session[:logged_in] then
      # Prune users that have completed their duration
      QueueRequest.prune_requests
      # If User is already queued, use that request to make timer
      @account = Account.find_by username: session[:username]
      @request = QueueRequest.find_by account_id: @account.id
      if @request == nil then

        # TODO Only create a request if the user has coins

        # User is not already queued, try to create request
        @request = QueueRequest.new(account_id: @account.id)
        @latest_end_time = QueueRequest.maximum("end_time")
        if @latest_end_time == nil then
          # If there is no queue request in the database, start now
          @request.start_time = DateTime.current().getutc().advance(seconds: 15)
        else
          # Set the next start time after the last queue request
          @request.start_time = @latest_end_time.advance(seconds: 2) 
        end
        # For now, queue time is 2 minutes
        @request.end_time = @request.start_time.advance(minutes: 2)
        @request.save
      end
      # Render a timer for the user that is in the queue
      # If the user is head of queue, give the timer 0 seconds left
      @now = DateTime.current().getutc()
      if @request.start_time < @now then
        @timer_seconds = 0
      else
        @timer_seconds = @request.start_time.to_i - @now.to_i
      end
    else
      # Not logged in
      head :ok, content_type: "text/html"
    end
  end

  # GET request for the head of queue controls
  def doge_control
    
  end

  def determine_queue_content
    if session[:logged_in] == true then
      if Account.exists?(username: session[:username]) == false then
        redirect_to controller: 'accounts', action: 'logout'
      end
      # Prune users that have completed their duration
      QueueRequest.prune_requests
      @account = Account.find_by username: session[:username]
      @request = QueueRequest.find_by account_id: @account.id
      # Check if te User has any requests
      if @request != nil then
        # User's request exists
        @now = DateTime.current().getutc()
        if @request.start_time < @now then
          if @request.end_time > @now then
            # Request is head of queue
            @load_control = true
          else
            # Request is overdue
            @load_button = true
          end
        else
          # User request is not head of queue
          @load_timer = true
          @timer_seconds = @request.start_time.to_i - @now.to_i
        end
      else
        # Logged in user has no request
        @load_button = true
      end
    else
      # User is not logged in
      @load_button = true
    end
  end
end
