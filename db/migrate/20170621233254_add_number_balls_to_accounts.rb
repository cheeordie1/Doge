class AddNumberBallsToAccounts < ActiveRecord::Migration
  def self.up
    unless column_exists? :accounts, :number_balls
      add_column :accounts, :number_balls, :integer
    end
  end
end
