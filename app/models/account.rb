class Account < ActiveRecord::Base
  def password_valid?(check_password)
    check_password_digest = OpenSSL::HMAC.hexdigest(sha512, Rails.application.secrets.doge_secret, check_password + self.salt)
    return self.password_digest == check_password_digest
  end

  def password=(set_password)
    if set_password == nil or set_password == ""
      return false
    end
    self.salt = SecureRandom.hex(256)
    sha512 = OpenSSL::Digest.new('sha512')
    self.password_digest = OpenSSL::HMAC.hexdigest(sha512, Rails.application.secrets.doge_secret, set_password + self.salt)
    return true
  end
end
