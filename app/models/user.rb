class User < ApplicationRecord
  has_many :expenses
  has_many :categories, through: :expenses

  def current_monthly_budget
    if budgets[this_month].nil?
      set_this_months_budget_to_default
    else
      budgets[this_month]
    end
  end

  private

  def this_month
    Time.new(Time.now.year, Time.now.month, Time.now.day).strftime("%Y-%m")
  end

  def set_this_months_budget_to_default
    self.budgets[this_month] = default_monthly_budget
    self.save!
  end
end
