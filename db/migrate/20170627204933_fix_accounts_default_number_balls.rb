class FixAccountsDefaultNumberBalls < ActiveRecord::Migration
  def self.up
    # Make sure no null exists in number_balls
    change_column_null(:accounts, :number_balls, false, 0)

    # Change the number_balls column to disallow null
    change_column(:accounts, :number_balls, :integer, :default => 0)

  end
end
