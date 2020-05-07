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
    talkToServer(response.tokenId)
  }

  return(
    <GoogleLogin
      clientId="261179776021-aia4ltj1eq494nmfj9fl7foh28o9ckdu.apps.googleusercontent.com"
      buttonText="Login"
      onSuccess={responseGoogle}
      onFailure={responseGoogle}
      isSignedIn={false}
      uxMode="popup"
      cookiePolicy={'single_host_origin'}
    />
  )
}

function talkToServer(token) {
  console.log(token);
  fetch(`/auth/google_oauth2/callback?token=${token}`)
    .then(res => res.json())
    .then((response) => { 
      console.log(response);
    })
    .catch((error) => { console.log("Error fetching data", error); })
}

export default Welcome;
