class UpdateCategoryAssociations < ActiveRecord::Migration[6.0]
  def change
    remove_reference :categories, :expense
    remove_reference :categories, :user

    add_belongs_to :expenses, :category
  end
end
