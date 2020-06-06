class Expense < ApplicationRecord
  validates :description, :amount, :timestamp, presence: true  
  belongs_to :user

  scope :this_month, -> { where(:timestamp => Time.now.beginning_of_month..Time.now.end_of_month) }
end
