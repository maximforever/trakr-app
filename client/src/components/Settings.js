import '../assets/stylesheets/Settings.scss';

import React, { Component } from 'react';

class Settings extends Component {

  constructor(props){
    super(props);

    this.state = {
      monthlyBudget: "",
      thisMonthBudget: "",
    }
  }

  componentDidMount(){
  }

  render(){
    return <div className="setting card">Get your settings in order</div>
  }
}

export default Settings;
