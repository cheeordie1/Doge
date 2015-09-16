class Account < ActiveRecord::Base
  
  before_validation :clean_color
  validates :username, presence: true, length: { minimum: 3 }
  validate :color_valid
  validate :username_not_taken, :on => :create
  validate :password_check, :on => :create

  def clean_color
    self.color = ActionController::Base.helpers.sanitize (self.color); 
  end

  def username_not_taken
    if Account.find_by_username(username) != nil then
      errors.add(:username, "is already taken")
    end 
  end

  def password_check
    if not @password.present?
      errors.add(:password, "can't be blank")
    end
    if @password.length < 8
      errors.add(:password, "is too short (minimum is 8 characters)")
    end
  end

  def color_valid
    if false then
      errors.add(:color, "Color is invalid.")
    end
  end

  def password_valid?(check_password)
    sha512 = OpenSSL::Digest.new('sha512')
    check_password_digest = OpenSSL::HMAC.hexdigest(sha512, Rails.application.secrets.doge_secret, check_password + self.salt)
    return password_digest == check_password_digest
  end

  def password=(set_password)
    @password = set_password
    self.salt = SecureRandom.hex(256)
    sha512 = OpenSSL::Digest.new('sha512')
    self.password_digest = OpenSSL::HMAC.hexdigest(sha512, Rails.application.secrets.doge_secret, set_password + self.salt)
  end
end
