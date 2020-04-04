require 'rails_helper'

RSpec.describe "Api::V1::Users", type: :request do

  describe "GET /monthly_budget" do
    it "returns http success" do
      get "/api/v1/users/monthly_budget"
      expect(response).to have_http_status(:success)
    end
  end

end
