import React from 'react';
import '../assets/stylesheets/navigation.scss';

function Navigation(props){
  return(
    <div>
      {renderNavbar(props)}
      {renderDateSelector(props)}
    </div>
  )
}

function renderNavbar(props){
  return (
    <div className="nav-bar card">
      <div className="nav-button button-text" onClick={() => props.navigateToPage("home")}>
        <span className="lnr lnr-home"></span>
      </div>
      <div className="nav-button button-text" onClick={() => props.navigateToPage("analytics")}>
        <span className="lnr lnr-chart-bars"></span>
      </div>
      <div className="nav-button button-text" onClick={() => props.navigateToPage("settings")}>
        <span className="lnr lnr-cog"></span>
      </div>
    </div>
  )
}

function renderDateSelector(props){
  if(!props.renderDateSelector){ return null; }
  return (
    <div className="nav-bar borderless date-selector card">
      <div className="nav-button button-text" onClick={() => props.previousMonth()}><span className="lnr lnr-chevron-left"></span></div>
      <div className="date button-text" onClick={() => props.setCurrentDate()}>{formattedDate(props.date)}</div>
      <div className="nav-button button-text" onClick={() => props.nextMonth()}><span className="lnr lnr-chevron-right"></span></div>
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