json.array!(@accounts) do |account|
  json.extract! account, :id, :username, :password, :salt
  json.url account_url(account, format: :json)
end
