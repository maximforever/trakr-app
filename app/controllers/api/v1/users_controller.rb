class Api::V1::UsersController < ApplicationController
  def show_settings
    render json: user_settings
  end

  def update_settings
    update_default_monthly_budget
    update_current_monthly_budget
    update_preferred_first_name

    if current_user.save!
      render json: user_settings
    else 
      render json: {
        status: "error"
      }
    end
  end

  private

  def user_settings 
    {
      defaultMonthlyBudget: current_user.default_monthly_budget,
      currentMonthlyBudget: current_user.current_monthly_budget,
      preferredFirstName: current_user.preferred_first_name,
      pastBudgets: current_user.budgets
    }
  end

  def update_default_monthly_budget
    if current_user.default_monthly_budget != params[:defaultMonthlyBudget] 
      current_user.default_monthly_budget = params[:defaultMonthlyBudget]
    end
  end

  def update_current_monthly_budget
    if current_user.budgets[this_month] != params[:currentMonthlyBudget] 
      current_user.budgets[this_month] = params[:currentMonthlyBudget]
    end    
  end

  def update_preferred_first_name
    current_user.preferred_first_name = params[:preferredFirstName].strip
  end

  def this_month
    Time.new(Time.now.year, Time.now.month, Time.now.day).strftime("%Y-%m")
  end
end
