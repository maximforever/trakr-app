class Api::V1::ExpensesController < ApplicationController
  def index
    render json:  {
      status: 200,
      expenses: expenses,
      categories: categories,
    } 
  end

  def create
    expense_params[:timestamp] = expense_params[:timestamp].to_datetime()
    expense_params[:category] = expense_params[:category].downcase()

    # TODO: replace with actual user
    @expense = Expense.new(expense_params.merge({ 
      user: User.first
    }))

    if @expense.save
      index
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

  def expenses
    User.first.expenses.order(created_at: :desc)
  end

  def categories
    expenses.map(&:category).reject(&:nil?).uniq
  end

  private

  def expense_params
    params.require(:expense).permit(:amount, :description, :merchant, :category, :timestamp)
  end

end
