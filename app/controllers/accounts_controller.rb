class AccountsController < ApplicationController
  before_action :set_account, only: [:show, :edit, :update, :destroy]

  # GET /accounts
  # GET /accounts.json
  def index
    @accounts = Account.all
  end

  # GET /accounts/1
  # GET /accounts/1.json
  def show
  end

  # GET /accounts/new
  def new
    if @account == nil then
      @account = Account.new
    end
    if params.has_key?(:special_message)
      @account.errors.add(:base, params[:special_message])
      response.headers["signup-error"] = "true"
      render "new"
    end
    @color = session[:color]
  end

  # GET /accounts/1/edit
  def edit
  end

  # POST /accounts
  # POST /accounts.json
  def create
    @account = Account.new(account_params)
    @account.password=(params[:account][:password])
    if @account.save then
      response.headers["signup-error"] = "false"
      session[:logged_in] = true
      session[:id] = @account.id
      session[:username] = @account.username
      session[:color] = @account.color
      head :ok
    else
      response.headers["signup-error"] = "true"
      render "new"
    end
  end

  # PATCH/PUT /accounts/1
  # PATCH/PUT /accounts/1.json
  def update
    respond_to do |format|
      if @account.update(account_params)
        format.html { redirect_to @account, notice: 'Account was successfully updated.' }
        format.json { render :show, status: :ok, location: @account }
      else
        format.html { render :edit }
        format.json { render json: @account.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /accounts/1
  # DELETE /accounts/1.json
  def destroy
    @account.destroy
    respond_to do |format|
      format.html { redirect_to accounts_url, notice: 'Account was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  # GET /accounts/login
  def login 
  end

  # POST /accounts/post_login
  def post_login
    error = nil
    if params[:login][:username] == "" || params[:login][:password] == "" then
      error = "Enter a username and password"
    else
      @account = Account.find_by_username(params[:login][:username])
      if @account == nil then
	    error = "Invalid username or password"
      else
        if not @account.password_valid? params[:login][:password] then
	      error = "Invalid username or password"
	    end
      end
    end
    if error != nil then
      flash[:login_form] = true
      flash[:login_error] = error
    else
      session[:logged_in] = true
      session[:id] = @account.id
      session[:username] = @account.username
      session[:color] = @account.color
    end
    head :ok, :login_error => error != nil
  end

  # GET /accounts/logout
  def logout
    reset_session
    if request.xhr?
      head :ok
    else
      redirect_to controller: 'doge', action: 'index'
    end
  end

  # GET /color
  def color
    if session[:logged_in] then
      # TODO Put these in a gon variable some day
      @image = "color_picker_top.png"
      @container_class = "color_container_top"
      @image_class = "color_picker_img_top"
      @color_picker_class = "color_picker_div_top"
      @opener = "open_color_picker"
      @map_coords = "219,7,229,36,260,62,351,60,361,221,53,221,49,60,181,57,202,38"
    else
      @image = "color_picker.png"
      @container_class = "color_container"
      @image_class = "color_picker_img"
      @color_picker_class = ["vert-center", "color_picker_div"]
      @opener = "open_color_picker_signup"
      @map_coords = "22,141,22,141,80,105,85,29,380,29,377,230,89,228,77,163"
    end
  end

  # POST /color
  def change_color
    if session[:logged_in] then
      session[:color] = params[:account_color]
      @account = Account.find_by_username(session[:username])
      @account.color = session[:color]
      @account.save
    end
    response.headers["color"] = session[:color]
    head :ok
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_account
      @account = Account.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def account_params
      params.require(:account).permit(:username, :password, :color)
    end
end
