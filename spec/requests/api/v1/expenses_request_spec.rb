require 'rails_helper'

RSpec.describe "Api::V1::Expenses", type: :request do

  describe "GET /create" do
    it "returns http success" do
      get "/api/v1/expenses/create"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /index" do
    it "returns http success" do
      get "/api/v1/expenses/index"
      expect(response).to have_http_status(:success)
    end
  end

end
