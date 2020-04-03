class MoveBudgetsToUser < ActiveRecord::Migration[6.0]
  def change
    change_table :expenses do |t|
      t.remove :budgets
    end

    change_table :users do |t|
      t.json :budgets
    end
  end
end
