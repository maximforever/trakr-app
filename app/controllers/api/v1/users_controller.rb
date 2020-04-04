class Api::V1::UsersController < ApplicationController
  def monthly_budget
    @user = User.first

    render json:  {monthlyBudget: @user.monthly_budget}
  end
end
