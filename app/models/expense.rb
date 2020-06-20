class Expense < ApplicationRecord
  validates :description, :amount, :timestamp, presence: true  
  belongs_to :user

  scope :for_year, -> (date) { where(:timestamp => date.beginning_of_year..date.end_of_year) }
end
