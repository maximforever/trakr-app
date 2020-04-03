class Api::V1::ExpensesController < ApplicationController
  #skip_before_action :verify_authenticity_token

  def index
    @expenses = Expense.all

    render json:  {expenses: @expenses}
  end

  def create
    @expense = Expense.new(expense_params.merge({user: User.first}))
    if @expense.save!
      render json:  {
        status: 200,
        expenses: User.first.expenses
      }  
    else
      puts "error: #{@expense.errors.full_messages}"
      render json:  {
        message: @expense.errors.full_messages
      }
    end
  end

  private

  def expense_params
    params.require(:expense).permit(:amount, :description, :merchant)
  end
end
