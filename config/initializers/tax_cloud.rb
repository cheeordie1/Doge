TaxCloud.configure do |config|
  config.api_login_id = ENV['TAXCLOUD_API_LOGIN_ID']
  config.api_key = ENV['TAXCLOUD_API_KEY']
end
class DogeTaxCloud
  @@doge_origin = TaxCloud::Address.new(
    address1: ENV['TAXCLOUD_ADDRESS1'],
    address2: ENV['TAXCLOUD_ADDRESS2'],
    city: ENV['TAXCLOUD_CITY'],
    state: ENV['TAXCLOUD_STATE'],
    zip5: ENV['TAXCLOUD_ZIP5']
  )

  def self.doge_origin
    return @@doge_origin
  end

  def self.doge_token(num_tokens)
    TaxCloud::CartItem.new(
      index: 0,
      item_id: 'DogeToken',
      price: Rails.application.config.cost_of_token,
      quantity: num_tokens
    )
  end
end
