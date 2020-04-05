import '../assets/stylesheets/Stats.scss';

import React, { Component } from 'react';

class Stats extends Component {

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
    return <div className="setting card">Look, stats!</div>
  }
}

export default Stats;
