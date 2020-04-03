class CreateUsers < ActiveRecord::Migration[6.0]
  def change
    create_table  :users do |t|
      t.string    :email
      t.string    :username
      t.integer   :default_monthly_budget

      t.timestamps
    end
  end
end
