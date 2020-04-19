import React, { Component } from 'react';
import '../assets/stylesheets/Welcome.scss';

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
        <p></p>
      </div>
    </div>
  )
}

export default Welcome;
