class Api::V1::ExpensesController < ApplicationController
  def index
    @expenses = User.first.expenses.order(created_at: :desc)

    render json:  {expenses: @expenses}
  end

  def create
    expense_params[:timestamp] = expense_params[:timestamp].to_datetime()

    @expense = Expense.new(expense_params.merge({ 
      user: User.first,
      category: find_or_create_category(params[:category]),
    }))

    if @expense.save
      render json:  {
        status: 200,
        expenses: User.first.expenses.order(created_at: :desc)
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

    render json:  {
      status: 200,
      expenses: User.first.expenses.order(created_at: :desc)
    } 
  end

  private

  def expense_params
    params.require(:expense).permit(:amount, :description, :merchant, :timestamp)
  end

  def find_or_create_category(category_name)
    if Category.where(name: category_name).any?
      return Category.where(name: category_name).first
    else 
      return Category.create(name: category_name)
    end
  end
end
