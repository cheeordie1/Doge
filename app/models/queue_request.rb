class QueueRequest < ActiveRecord::Base
  validate :user_is_real, :on => :create
  validate :not_in_queue, :on => :create
  validate :control_time, presence: true
  
  def user_is_real
    if Account.find(account_id) == nil
      errors.add(:user, "does not exist");
    end
  end

  def not_in_queue
    if QueueRequest.find_by_account_id(account_id) != nil
      errors.add(:queue_request, "already in the queue")
    end
  end
end
