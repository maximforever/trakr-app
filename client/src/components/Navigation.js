import React from 'react';
import '../assets/stylesheets/Navigation.scss';

function Navigation(props){
  return(
    <div className="nav-bar">
      <div className="nav-button" onClick={() => props.navigateToPage("home")}><span className="lnr lnr-home"></span></div>
      <div className="nav-button" onClick={() => props.navigateToPage("stats")}><span className="lnr lnr-chart-bars"></span></div>
      <div className="nav-button" onClick={() => props.navigateToPage("settings")}><span className="lnr lnr-cog"></span></div>
    </div>
  )
}

export default Navigation;