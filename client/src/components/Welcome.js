import React, { Component } from 'react';
import '../assets/stylesheets/welcome.scss';
import { GoogleLogin } from 'react-google-login';

function Welcome(){
  return(
    <div className="welcome-page card">
      <h1>Welcome to Trakr</h1>
      <h3>Trakr helps you</h3>
      <ul>
        <li>stay mindful of your spending</li>
        <li>prevent impulse purchases</li>
        <li>find holes in your budget</li>
      </ul>

      <div>
        <p>To get started, sign in with your Google account</p>
        <p>{ renderGoogleLoginButton() }</p>
      </div>
    </div>
  )
}

function renderGoogleLoginButton() {
  const responseGoogle = (response) => {
    console.log(response);
    talkToServer(response.accessToken)
  }

  return(
    <GoogleLogin
      clientId="261179776021-aia4ltj1eq494nmfj9fl7foh28o9ckdu.apps.googleusercontent.com"
      buttonText="Login"
      onSuccess={responseGoogle}
      onFailure={responseGoogle}
      uxMode="redirect"
      redirectUri="http://localhost:3000/auth/google_oauth2/callback"
      cookiePolicy={'single_host_origin'}
    />
  )
}

function talkToServer(token) {
  console.log(token);
}

export default Welcome;
