class Expense < ApplicationRecord
  validates :description, :amount, :timestamp, presence: true  
  belongs_to :user

  scope :for_month, -> (date) { where(:timestamp => date.beginning_of_month..date.end_of_month) }
end
