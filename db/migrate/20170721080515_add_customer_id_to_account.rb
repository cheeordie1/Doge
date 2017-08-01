class AddCustomerIdToAccount < ActiveRecord::Migration
  def self.up
    add_column :accounts, :customer_id, :integer
  end
end
