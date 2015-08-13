class DogeController < ApplicationController

  def index
  end

  def woof
    @deliverable_msg = params[:deliverable_msg]
    PrivatePub.publish_to "/woof", :deliverable_msg => @deliverable_msg
  end

end
