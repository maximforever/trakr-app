class SessionsController < ApplicationController
    def create      
      if(token_is_valid?)
        @user = User.find_or_create_from_token(decoded_token, "google")
        session[:user_id] = @user.id
        redirect_to '/'
      else
        puts "THAT'S NOT A VALID TOKEN"
        render json:  {
          error: "invalid token",
          status: "error",
          code: 500
        }
      end
    end

    def destroy
      session[:user_id] = nil
      redirect_to '/'
    end

    def show
      status = user_signed_in? ? "loggedIn" : "loggedOut"
      render json:  {
        loggedIn: status,
        loggedInUser: signed_in_user_data
      }
    end

    private

    def signed_in_user_data 
      return nil unless user_signed_in?

      return {
        email: current_user.email,
        firstName: current_user.preferred_first_name,
        image: current_user.image
      }

    end

    def token
      params[:token]
    end

    def decoded_token
      token_data = JWT.decode token, nil, false
      token_data[0]
    end

    def token_is_valid?
      validator = GoogleIDToken::Validator.new

      begin
        payload = validator.check(token, decoded_token["aud"], ENV["GOOGLE_CLIENT_ID"])
        true
      rescue GoogleIDToken::ValidationError => e
        report "Cannot validate: #{e}"
      end
    end

    def user_id
      decoded_token["sub"]
    end
end
