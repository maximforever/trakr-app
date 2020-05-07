class ApplicationController < ActionController::Base
  # TODO: research and fix this
  skip_before_action :verify_authenticity_token

  def authenticate
    puts "AUTHENTICATION: user_signed_in? #{user_signed_in?}"
    puts session.to_h

    redirect_to '/' unless user_signed_in?
  end

  def current_user
    @current_user ||= User.find(session[:user_id]) if session[:user_id]
  end

  def user_signed_in?
    !!current_user
  end
end
