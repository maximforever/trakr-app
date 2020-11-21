user        = User.first
first_day   = Date.today.beginning_of_month + 12.hours
second_day  = first_day + 1.days
third_day   = first_day + 2.days


Expense.create!(user: user, amount: 12, description: "doots", timestamp: first_day, category: "doot fund")
Expense.create!(user: user, amount: 7, description: "bleps", timestamp: first_day, category: "bleppings")
Expense.create!(user: user, amount: 6, description: "coffee", timestamp: first_day, category: "coffee")
Expense.create!(user: user, amount: 16, description: "doots", timestamp: second_day, category: "doot fund")
Expense.create!(user: user, amount: 13, description: "bleps", timestamp: second_day, category: "bleppings")
Expense.create!(user: user, amount: 3, description: "coffee", timestamp: second_day, category: "coffee")
Expense.create!(user: user, amount: 12, description: "doots", timestamp: third_day, category: "doot fund")
Expense.create!(user: user, amount: 7, description: "bleps", timestamp: third_day, category: "bleppings")
Expense.create!(user: user, amount: 6, description: "coffee", timestamp: third_day, category: "coffee")
Expense.create!(user: user, amount: 16, description: "doots", timestamp: third_day, category: "doot fund")
Expense.create!(user: user, amount: 13, description: "bleps", timestamp: third_day, category: "bleppings")
Expense.create!(user: user, amount: 3, description: "coffee", timestamp: third_day, category: "coffee")