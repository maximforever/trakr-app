class AddUserLoginAttributes < ActiveRecord::Migration[6.0]
  def up
    add_column :users, :uid,  :string
    add_column :users, :image,                  :string
    add_column :users, :first_name,             :string
    add_column :users, :last_name,              :string
    add_column :users, :provider,               :string
    add_column :users, :preferred_first_name,   :string
    remove_column :users, :username
  end

  def down
    remove_column :users,           :uid
    remove_column :users,           :image
    remove_column :users,           :first_name
    remove_column :users,           :last_name
    remove_column :users,           :provider
    remove_column :users,           :preferred_first_name,   :string
    add_column :users, :username,   :string
  end
end
