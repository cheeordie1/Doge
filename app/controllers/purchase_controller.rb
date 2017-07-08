class PurchaseController < ApplicationController

  # GET /purchase
  # Returns the braintree drop-in to purchase tokens
  def buy_token
    
  end

  # POST /purchase
  # Submits a form with purchase information to send to Braintree server
  def post_buy_token
    # Whitelist parameters for buying tokens
    purchase_params 
  end

  private
    def purchase_params
      params.permit(:number_tokens, :payment_method_nonce, :payment_method_token)
    end

end
