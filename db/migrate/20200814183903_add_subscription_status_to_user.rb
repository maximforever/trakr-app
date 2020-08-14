class AddSubscriptionStatusToUser < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :subscription_status, :string, default: nil
  end
end
