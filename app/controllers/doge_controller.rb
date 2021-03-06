class DogeController < ApplicationController

  @@default_first_queue_time = 10
  @@default_next_queue_time = 2

  #GET root
  def index
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

  # POST /doge_token_dropin
  # Confirm a purchase and send to the server
  def post_doge_token_dropin
    if current_user then
      tokens = params[:num_tokens]
      # CREATE TEST TRANSACTION TODO Make it work
      # Handle Taxes for Taxcloud
      customer = @current_user
      # TODO Change this to retrieved destination
      test_destination = TaxCloud::Address.new(
        address1: '317 112th Ave NE',
        address2: 'Room 1016',
        city: 'Bellevue',
        state: 'WA',
        zip5: '98004'
      )
      transaction = TaxCloud::Transaction.new(
        customer_id: customer.customer_id,
        cart_id: '1',
        origin: DogeTaxCloud.doge_origin,
        destination: test_destination
      )
      transaction.cart_items << DogeTaxCloud.doge_token(tokens)
      session[:transaction] = transaction
      #lookup = transaction.lookup # Returns a TaxCloud::Responses::Lookup
      puts "TAX AMOUNT:"
#      puts lookup.tax_amount

      # Error if no transaction is in the process
      if session[:transaction] == nil then
        render json: {error: "Transaction Not Properly Set Up"}, status: 401
        return
      else
        transaction = session[:transaction]
      end

      # Process payment base cost, add sales tax amount
      amount = calculate_base_cost(tokens) #+ lookup.tax_amount

      # Transaction.sale and create a new Customer id if none is specified
      if @current_user.customer_id == nil then
        result = Braintree::Customer.create
        if result.success? then
          # If there was no customer ID, add customer id
          if @current_user.customer_id == nil then
            @current_user.customer_id = result.customer.id
            @current_user.save
          end
        else
          # Handle customer creation failure
          render json: {error: result.message}, status: 401
          session[:transaction] = nil
          return
        end
      end

      result = Braintree::Transaction.sale(
        payment_method_nonce: params[:payment_method_nonce],
        amount: amount,
        customer_id: @current_user.customer_id,
        options: {
          submit_for_settlement: true,
          store_in_vault_on_success: true
        }
      )

      if result.success? then
        # Transaction customer ID should be the same as user customer ID
        if result.transaction.customer_details.id.to_i != @current_user.customer_id.to_i then
          flash[:error] = "Unexpected Error"
          session[:transaction] = nil
          raise "Customer ID Mismatch"
        else
          # Handle Taxes for Taxcloud
          transaction.order_id = result.transaction.order_id
          transaction.authorized_with_capture # returns "OK" or raises error          
        end
      else
        # Deal with the settlement errors
        render json: {error: result.message}, status: 401
        return
      end
      render json: {success: "Purchase Success!"}, status: 200
    else
      render json: {error: "Not Logged In"}, status: 401
    end
  end

  # GET /doge_token_dropin
  # Request the html form that loads the braintree dropin
  def doge_token_dropin
    if params[:num_tokens] == nil then
      params[:num_tokens] = 0
    end

    # Set the base cost of the tokens
    # TODO fix this to be the full cost + tax
    @base_cost = calculate_base_cost(params[:num_tokens])

    if current_user then
      # Generate Braintree payment token for logged in users
      @client_token = Braintree::ClientToken.generate(customer_id: @current_user.customer_id)
    else
      # Render an error for non logged in users
      render status: 401
    end
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
  def calculate_base_cost(numTokens)
    return numTokens * Rails.application.config.cost_of_token
  end

  helper_method :get_number_balls, :get_queue_time, :calculate_cost
end
