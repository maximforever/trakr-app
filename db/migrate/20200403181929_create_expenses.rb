class CreateExpenses < ActiveRecord::Migration[6.0]
  def change
    create_table :expenses do |t|
      t.belongs_to  :user

      t.integer     :amount
      t.string      :description
      t.json        :budgets
      t.string      :merchant

      t.timestamps
    end
  end
end
