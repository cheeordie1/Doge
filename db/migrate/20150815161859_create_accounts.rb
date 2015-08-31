class CreateAccounts < ActiveRecord::Migration
  def change
    create_table :accounts do |t|
      t.string :username
      t.string :password_digest
      t.string :salt
      t.string :color

      t.timestamps
    end
  end
end
