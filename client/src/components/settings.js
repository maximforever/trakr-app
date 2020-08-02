import '../assets/stylesheets/settings.scss';

import React, { Component } from 'react';

class Settings extends Component {

  constructor(props){
    super(props);

    this.state = {
      defaultMonthlyBudget: this.props.defaultMonthlyBudget,
      currentMonthlyBudget: this.props.currentMonthlyBudget,
      preferredFirstName: this.props.preferredFirstName,
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
            <input value={this.state.defaultMonthlyBudget} type='number' name='defaultMonthlyBudget' onChange={this.handleInputChange}></input>
          </div>

          <div className="one-input">
            <label>This month's budget</label>
            <input value={this.state.currentMonthlyBudget} type='number' name='currentMonthlyBudget' onChange={this.handleInputChange}></input>
          </div>

          <div className="one-input">
            <label>Preferred first name</label>
            <input value={this.state.preferredFirstName} type='text' name='preferredFirstName' onChange={this.handleInputChange}></input>
          </div>

          <div className="button-wrapper">
            <button className="submit md" disabled={this.validSettings()}>Update Settings</button>
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
    
    const newSettings = {
      defaultMonthlyBudget: Number(this.state.defaultMonthlyBudget),
      currentMonthlyBudget: Number(this.state.currentMonthlyBudget),
      preferredFirstName: this.state.preferredFirstName.trim(),
    }

    this.props.updateUserSettings(newSettings);
  }

  validSettings(){
    return (this.state.monthlyBudget === 0 || this.state.currentMonthlyBudget === 0);
  }


}

export default Settings;
