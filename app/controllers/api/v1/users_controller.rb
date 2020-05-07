class Api::V1::UsersController < ApplicationController
  def show_monthly_budget
    render json:  {
      monthlyBudget: current_user.default_monthly_budget,
      currentMonthlyBudget: current_user.current_monthly_budget
    }
  end

  def update_monthly_budget
    update_default_monthly_budget
    update_current_monthly_budget
    if current_user.save!
      render json:  {
        monthlyBudget: current_user.default_monthly_budget,
        currentMonthlyBudget: current_user.current_monthly_budget
      }
    else 
      render json: {
        status: "error"
      }
    end
  end

  private

  def update_default_monthly_budget
    if user.default_monthly_budget != params[:monthlyBudget] 
      user.default_monthly_budget = params[:monthlyBudget]
    end
  end

  def update_current_monthly_budget
    if user.budgets[this_month] != params[:currentMonthlyBudget] 
      user.budgets[this_month] = params[:currentMonthlyBudget]
    end    
  end

  def this_month
    Time.new(Time.now.year, Time.now.month, Time.now.day).strftime("%Y-%m")
  end
end
