import '../assets/stylesheets/Settings.scss';

import React, { Component } from 'react';

class Settings extends Component {

  constructor(props){
    super(props);

    this.state = {
      monthlyBudget: this.props.monthlyBudget,
      currentMonthlyBudget: this.props.currentMonthlyBudget,
    }

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render(){
    return (
      <div className="setting card">
        <h3>Settings</h3>
        
        <form onSubmit={this.handleSubmit}>
          <div className="one-input">
            <label>Default budget</label>
            <input value={this.state.monthlyBudget} type='number' name='monthlyBudget' onChange={this.handleInputChange}></input>
          </div>

          <div className="one-input">
            <label>This month's budget</label>
            <input value={this.state.currentMonthlyBudget} type='number' name='currentMonthlyBudget' onChange={this.handleInputChange}></input>
          </div>

          <div className="button-wrapper">
            <button className="submit" disabled={this.validSettings()}>Update Settings</button>
          </div>

        </form>
      </div>
    )
  }

  handleInputChange(e){
    const name = e.target.name;
    this.setState({
      [name]: e.target.value
    });
  }

  handleSubmit(e){
    e.preventDefault(e);
    
    const newBudget = {
      monthlyBudget: Number(this.state.monthlyBudget),
      currentMonthlyBudget: Number(this.state.currentMonthlyBudget),
    }

    this.props.updateMonthlyBudget(newBudget);
  }

  validSettings(){
    return (this.state.monthlyBudget === 0 || this.state.currentMonthlyBudget === 0);
  }


}

export default Settings;
