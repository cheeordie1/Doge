class QueueRequest < ActiveRecord::Base

  belongs_to :account

  validates :start_time, presence: true
  validates :end_time, presence: true
  validate :user_is_real
  validate :not_in_queue
  
  def user_is_real
    if Account.exists?(account_id) == false then
      errors.add(:user, "does not exist");
    end
  end

  def not_in_queue
    if QueueRequest.exists?(account_id: account_id) == true then
      errors.add(:queue_request, "already in the queue")
    end
  end

  def self.prune_requests
    QueueRequest.delete_all(["end_time < ?", DateTime.current().getutc()])
  end
end
