class DogeController < ApplicationController

  @@default_first_queue_time = 10
  @@default_next_queue_time = 2

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
    # include timer image url variables in page to access in javascript 
    gon.timerNumberURLs = [view_context.image_path("0.png"),
                           view_context.image_path('1.png'), 
                           view_context.image_path('2.png'),
                           view_context.image_path('3.png'),
                           view_context.image_path('4.png'),
                           view_context.image_path('5.png'),
                           view_context.image_path('6.png'),
                           view_context.image_path('7.png'),
                           view_context.image_path('8.png'),
                           view_context.image_path('9.png')]    
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
    # include timer image url variables in page to access in javascript 
    gon.timerNumberURLs = [view_context.image_path("0.png"),
                           view_context.image_path('1.png'), 
                           view_context.image_path('2.png'),
                           view_context.image_path('3.png'),
                           view_context.image_path('4.png'),
                           view_context.image_path('5.png'),
                           view_context.image_path('6.png'),
                           view_context.image_path('7.png'),
                           view_context.image_path('8.png'),
                           view_context.image_path('9.png')]  
    @timer_seconds = 145
    render "doge_enqueue"
  end

  # POST /doge_enqueue
  def doge_enqueue
    if session[:logged_in] then
      # Prune users that have completed their duration
      QueueRequest.prune_requests
      # If User is already queued, use that request to make timer
      @account = current_user
      if @account.queue_request == nil then
        # TODO Only create a request if the user has coins

        # User is not already queued, try to create request
        @latest_end_time = QueueRequest.maximum("end_time")
        if @latest_end_time == nil then
          # If there is no queue request in the database, start now
          @start_time = DateTime.current().getutc().advance(seconds:
                                                    @@default_first_queue_time)
        else
          # Set the next start time after the last queue request
          @start_time = @latest_end_time.advance(seconds:
                                                @@default_next_queue_time)
        end
        # For now, control time is 2 minutes
        @end_time = @start_time.advance(minutes: @@default_next_queue_time)
        @account.create_queue_request(start_time: @start_time, end_time: @end_time)
      end
      # Render a timer for the user that is in the queue
      # If the user is head of queue, give the timer 0 seconds left
      @now = DateTime.current().getutc()
      if @account.queue_request.start_time < @now then
        @timer_seconds = 0
      else
        @timer_seconds = @account.queue_request.start_time.to_i - @now.to_i
      end
    else
      # Not logged in
      head :ok, content_type: "text/html"
    end
  end

  # GET /doge_control
  # request for the head of queue controls
  def doge_control
      @next_queue_time = get_queue_time
  end

  # POST request for the head of queue controls
  def doge_control_signal
  end

  # GET /doge_token_dropin
  # request the html form that loads the braintree dropin
  def doge_token_dropin
    if params[:num_tokens] == nil then
      params[:num_tokens] = 0
    end
    # Generate Braintree payment token
    @client_token = Braintree::ClientToken.generate
  end

  # Helper to determine what html to load for doge button
  def determine_queue_content
    if session[:logged_in] == true then
      @account = current_user
      if @account == nil then
        redirect_to controller: 'accounts', action: 'logout'
      end
      # Prune users that have completed their duration
      QueueRequest.prune_requests
      @request = @account.queue_request
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

  # Helper to get number of balls belonging to current user
  def get_number_balls
    @account = current_user
    if @account != nil then
      return @account.number_balls
    else
      return 0
    end
  end

  # Helper to get queue time
  def get_queue_time
    @account = current_user
    # if the user is not logged in, give arbitrary time
    if @account == nil then
      if Rails.env.development? then
        return 140
      else
        return 0
      end
    end
    @userRequest = @account.queue_request
    # if there is no actual queue request, give arbitrary time
    if @userRequest == nil then
      if Rails.env.development? then
        return 140
      else
        return 0
      end    
    end
    # Compare request end time to now
    @now = DateTime.current().getutc()
    if @now <= @userRequest.end_time then
      # Return time left in seconds
      return @userRequest.end_time.to_i - @now.to_i
    else
      return 0
    end    
  end

  # Helper method to calculate cost of token purchase
  def calculate_cost(numTokens)
    return ActionController::Base.helpers.number_to_currency(numTokens * Rails.application.config.cost_of_token)
  end

  helper_method :get_number_balls, :get_queue_time, :calculate_cost
end
