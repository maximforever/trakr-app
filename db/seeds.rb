# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)



user        = User.first
first_day   = Date.today.beginning_of_month + 12.hours
second_day  = first_day + 1.days
third_day   = first_day + 2.days


Expense.create!(user: user, amount: 12, description: "doots", merchant: "", timestamp: first_day, category: "doot fund")
Expense.create!(user: user, amount: 7, description: "bleps", merchant: "", timestamp: first_day, category: "bleppings")
Expense.create!(user: user, amount: 6, description: "coffee", merchant: "", timestamp: first_day, category: "coffee")
Expense.create!(user: user, amount: 16, description: "doots", merchant: "", timestamp: second_day, category: "doot fund")
Expense.create!(user: user, amount: 13, description: "bleps", merchant: "", timestamp: second_day, category: "bleppings")
Expense.create!(user: user, amount: 3, description: "coffee", merchant: "", timestamp: second_day, category: "coffee")
Expense.create!(user: user, amount: 12, description: "doots", merchant: "", timestamp: third_day, category: "doot fund")
Expense.create!(user: user, amount: 7, description: "bleps", merchant: "", timestamp: third_day, category: "bleppings")
Expense.create!(user: user, amount: 6, description: "coffee", merchant: "", timestamp: third_day, category: "coffee")
Expense.create!(user: user, amount: 16, description: "doots", merchant: "", timestamp: third_day, category: "doot fund")
Expense.create!(user: user, amount: 13, description: "bleps", merchant: "", timestamp: third_day, category: "bleppings")
Expense.create!(user: user, amount: 3, description: "coffee", merchant: "", timestamp: third_day, category: "coffee")