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
    @expense = current_user.expenses.build(expense_params.merge({ 
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

  def update
    @expense = Expense.find(params[:id])

    if @expense.update(expense_params.except(:id))
      render json: {
        status: 200,
        updatedExpense: @expense
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
    #TODO: make this a scope or something
    current_user.expenses.map(&:category).uniq - ["uncategorized"]
  end

  private

  def expense_params
    params.require(:expense).permit(:amount, :description, :category, :timestamp)
  end
end
