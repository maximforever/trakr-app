class CreateCategories < ActiveRecord::Migration[6.0]
  def change
    create_table :categories do |t|
      t.belongs_to  :expense
      t.belongs_to  :user

      t.string      :name

      t.timestamps
    end
  end
end
