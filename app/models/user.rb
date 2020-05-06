class User < ApplicationRecord
  has_many :expenses
  has_many :categories, through: :expenses

  def current_monthly_budget
    set_this_months_budget_to_default if self.budgets[this_month].nil?
    self.budgets[this_month]
  end

  def self.find_or_create_from_token(token, provider)
    puts "TOKEN"
    puts token
    puts "====="
    where(uid: token['sub']).first_or_initialize.tap do |user|
      user.provider = provider
      user.uid = token['sub']
      user.first_name = token['given_name']
      user.last_name = token['family_name']
      user.email = token['email']
      user.image = token['picture']
      user.budgets = {}
      user.default_monthly_budget = 1000
      user.preferred_first_name = token['given_name']
      user.save!
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
