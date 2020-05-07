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

      user_email = user_signed_in? ? current_user.email : nil

      render json:  {
        loggedIn: user_signed_in?,
        email: user_email
      }
    end

    private

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
