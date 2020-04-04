class AddDateToExpenses < ActiveRecord::Migration[6.0]
  def up
    add_column :expenses, :timestamp, :datetime
  end

  def down
    remove_column :expenses, :timestamp
  end
end
