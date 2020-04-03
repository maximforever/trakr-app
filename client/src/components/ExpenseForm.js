import '../assets/stylesheets/App.scss';

import React, { Component } from 'react';

class ExpenseForm extends Component {

  constructor(props){
    super(props);

    this.state = {
      amount: 0,
      description: "",
      merchant: "",
    }

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
    console.log(e);
  }

  submitData(){
    const newExpense = {
      amount: this.state.amount,
      description: this.state.description,
      merchant: this.state.merchant,
    }

    this.props.submitNewExpense(newExpense);
  }

  render(){
    return (
      <div className="new-expense-form">
        <h3>New Expense</h3>
        <form onSubmit={this.handleSubmit}>
          <label>Amount:
            <input value={this.state.amount} type='number' name='amount' onChange={this.handleInputChange}></input>
            <br />
          </label>

          <label>Description:
            <input value={this.state.description} type='text' name='description' onChange={this.handleInputChange}></input>
            <br />
          </label>

          <label>Merchant:
            <input value={this.state.merchant} type='text' name='merchant' onChange={this.handleInputChange}></input>
            <br />
          </label>
          <button>Add Expense</button>
        </form>
      </div>
    )
  }
}

export default ExpenseForm;
