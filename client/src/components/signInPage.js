import React from "react";
import "../assets/stylesheets/sign-in-page.scss";
import "../assets/stylesheets/app.scss";
import { GoogleLogin } from "react-google-login";

function SignInPage() {
  return (
    <div className="non-navigation-content">
      <div className="logged-out-page card">
        <h1>Welcome to Trakr</h1>
        <h3>Trakr helps you</h3>
        <ul>
          <li>stay mindful of your spending</li>
          <li>prevent impulse purchases</li>
          <li>find holes in your budget</li>
        </ul>

        <div>
          <p>To get started, sign in with your Google account</p>
          <div className="button-wrapper">{renderGoogleLoginButton()}</div>
        </div>
      </div>
    </div>
  );
}

function renderGoogleLoginButton() {
  const successfulGoogleResponse = (response) => {
    window.location.href = `/auth/google_oauth2/callback?token=${response.tokenId}`;
  };

  const failedGoogleResponse = (response) => {
    console.log(response);
  };

  return (
    <GoogleLogin
      clientId="261179776021-aia4ltj1eq494nmfj9fl7foh28o9ckdu.apps.googleusercontent.com"
      buttonText="Login"
      onSuccess={successfulGoogleResponse}
      onFailure={failedGoogleResponse}
      isSignedIn={false}
      uxMode="popup"
      cookiePolicy={"single_host_origin"}
    />
  );
}

export default SignInPage;
