import '../assets/stylesheets/App.scss';

import React, { Component } from 'react';

class ExpenseForm extends Component {

  constructor(props){
    super(props);

    this.state = {
      amount: "",
      description: "",
      merchant: "",
      timestamp: "",
    }

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setDateTimePickerToNow = this.setDateTimePickerToNow.bind(this);
  }

  componentDidMount(){
    this.setDateTimePickerToNow();
  }

  handleInputChange(e){
    const name = e.target.name;
    this.setState({
      [name]: e.target.value
    });
  }

  handleSubmit(e){
    e.preventDefault(e);
    this.submitData();
  }

  resetState(){
    this.setState({
      amount: "",
      description: "",
      merchant: "",
      timestamp: "",
    })
  }

  submitData(){
    const newExpense = {
      amount: this.state.amount,
      description: this.state.description,
      merchant: this.state.merchant,
      timestamp: this.state.timestamp,
    }

    this.props.submitNewExpense(newExpense);
    this.resetState();
  }

  setDateTimePickerToNow(){
    const timezoneOffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    const currentDatetime = new Date(Date.now() - timezoneOffset).toISOString().slice(0,16);
    this.setState({
      timestamp: currentDatetime
    })
  }

  validExpense(){
    return (this.state.amount === 0 || this.state.description.length < 2);
  }

  render(){
    return (
      <div className="new-expense-form card">
        <h3>New Expense</h3>
        <form onSubmit={this.handleSubmit}>
          <div className="one-input">
            <label>Amount:</label>
            <input value={this.state.amount} type='number' name='amount' onChange={this.handleInputChange}></input>
          </div>

          <div className="one-input">
            <label>Description:</label>
            <input value={this.state.description} type='text' name='description' onChange={this.handleInputChange}></input>
          </div>

          <div className="one-input">
            <label>Merchant:</label>
            <input value={this.state.merchant} type='text' name='merchant' onChange={this.handleInputChange}></input>
          </div>

          <div className="one-input">
            <label>Date:</label>
            <input value={this.state.timestamp} type='datetime-local' name='timestamp' onChange={this.handleInputChange}></input>
          </div>

          <button disabled={this.validExpense()}>Add Expense</button>
        </form>
      </div>
    )
  }
}

export default ExpenseForm;
