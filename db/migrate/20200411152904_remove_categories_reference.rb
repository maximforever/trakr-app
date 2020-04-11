class RemoveCategoriesReference < ActiveRecord::Migration[6.0]
  def change
    remove_reference :expenses, :category
    add_column :expenses, :category, :string
  end
end
