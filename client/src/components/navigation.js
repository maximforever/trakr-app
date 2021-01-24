import React from 'react';
import '../assets/stylesheets/navigation.scss';

function Navigation(props){
  return(
    <div className="navigation-section">
      {renderNavbar(props)}
      {renderDateSelector(props)}
    </div>
  )
}

function renderNavbar(props){
  return (
      <div className="navigation-full-width-wrapper">
        <div className="nav-bar borderless card navigation-icon-bar">
          <div className="nav-button button" onClick={() => props.navigateToPage("home")}>
            {/*<span className="lnr lnr-home"></span>*/}
            <img className = "user-photo" src={props.userImage} alt="profile pic" />
          </div>
          <div className="nav-button button" onClick={() => props.navigateToPage("analytics")}>
            <span className="lnr lnr-pie-chart"></span>
          </div>
          <div className="nav-button button" onClick={() => props.navigateToPage("settings")}>
            <span className="lnr lnr-menu"></span>
          </div>
        </div>
      </div>
  )
}

function renderDateSelector(props){
  if(!props.renderDateSelector){ return null; }
  return (
    <div className="nav-bar borderless card date-selector">
      <div className="nav-button button" onClick={() => props.previousMonth()}><span className="lnr lnr-chevron-left"></span></div>
      <div className="date button" onClick={() => props.setCurrentDate()}>{formattedDate(props.date)}</div>
      <div className="nav-button button" onClick={() => props.nextMonth()}><span className="lnr lnr-chevron-right"></span></div>
    </div>
  )
}

function formattedDate(date){
  const stringMonths = [
    "January", 
    "February", 
    "March", 
    "April", 
    "May", 
    "June",
    "July", 
    "August", 
    "September",
    "October", 
    "November", 
    "December",
  ]

  return `${stringMonths[date.month - 1]} ${date.year}`
}

export default Navigation;