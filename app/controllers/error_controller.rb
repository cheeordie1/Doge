class ErrorController < ApplicationController

  # GET /404
  def page_not_found
    render(status: 404)
  end

end
