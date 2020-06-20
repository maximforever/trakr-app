class Api::V1::ExpensesController < ApplicationController
  before_action :authenticate

  def index
    render json:  {
      status: 200,
      expenses: expenses(params[:year]),
      categories: categories,
    } 
  end

  def create
    @expense = Expense.new(expense_params.merge({ 
      user: current_user,
      timestamp: expense_params[:timestamp].to_datetime(),
      category: expense_params[:category].blank? ? 'uncategorized' : expense_params[:category].downcase()
    }))

    if @expense.save
      render json: {
        status: 200,
        newExpense: @expense
      }
    else
      render json:  {
        status: 500,
        message: @expense.errors.full_messages
      }
    end
  end

  def destroy
    @expense = Expense.find(params[:id]);
    @expense.destroy

    index
  end

  def expenses(year)
    current_user.expenses.for_year(Time.parse("#{year}-01-01")).order(created_at: :desc)
  end

  def categories
    #TODO: fetch all the categories, not just from this month
    expenses(params[:year]).map(&:category).reject(&:nil?).uniq
  end

  private

  def expense_params
    params.require(:expense).permit(:amount, :description, :merchant, :category, :timestamp)
  end

end
