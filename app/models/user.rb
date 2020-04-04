class User < ApplicationRecord
  has_many :expenses
  has_many :categories, through: :expenses

  def monthly_budget
    # TODO: check if budget for this month exists - and send that number
    default_monthly_budget
  end
end
