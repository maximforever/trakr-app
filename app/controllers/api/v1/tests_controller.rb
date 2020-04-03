class Api::V1::TestsController < ApplicationController
  def index
    render json:  {users: ['John', 'Kate', 'Harry', 'Mary']}
  end
end
