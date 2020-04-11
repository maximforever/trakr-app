class Expense < ApplicationRecord
  validates :description, :amount, :timestamp, presence: true
  
  belongs_to :user
  belongs_to :category
end
