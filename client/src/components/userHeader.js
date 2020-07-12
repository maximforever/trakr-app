import React from 'react';
import '../assets/stylesheets/userHeader.scss';

function UserHeader(props) {
  return (
    <div className="user-header">
      <div className="user-header-data"> 
        <img className = "user-photo" src={props.user.image} alt="profile-pic" />
        <span>{ props.greeting }, {props.user.firstName}</span> 
      </div>
      <div className="user-header-account">
        <a className="logout" href = "/logout">
          <span>Log out</span>
          <span className   ="lnr lnr-arrow-right"></span>
        </a>
      </div>
    </div>
  )
}

export default UserHeader;