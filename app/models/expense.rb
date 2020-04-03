class Expense < ApplicationRecord
  validates :description, :amount, presence: true
  
  belongs_to :user
  has_one :category
end
