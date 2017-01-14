class CreateAccounts < ActiveRecord::Migration
  def change
    create_table :accounts do |t|
      t.string :username
      t.text :password_digest
      t.text :salt
      t.string :color

      t.timestamps
    end
  end
end
