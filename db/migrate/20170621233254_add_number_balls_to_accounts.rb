class AddNumberBallsToAccounts < ActiveRecord::Migration
  def self.up
    add_column :accounts, :number_balls, :integer
  end
end
