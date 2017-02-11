class CreateQueueRequests < ActiveRecord::Migration
  def change
    create_table :queue_requests do |t|
      t.integer :account_id
      t.datetime :start_time
      t.datetime :end_time

      t.timestamps
    end
  end
end
