if Rails.env.development?
  Braintree::Configuration.environment = :sandbox
elsif Rails.env.production?
  Braintree::Configuration.environment = :production
end
Braintree::Configuration.logger = Logger.new('log/braintree.log')
Braintree::Configuration.merchant_id = ENV['BRAINTREE_MERCHANT_ID']
Braintree::Configuration.public_key = ENV['BRAINTREE_PUBLIC_KEY']
Braintree::Configuration.private_key = ENV['BRAINTREE_PRIVATE_KEY']
# BraintreeRails::Configuration.client_side_encryption_key = ENV['BRAINTREE_CLIENT_SIDE_ENCRYPTION_KEY']
