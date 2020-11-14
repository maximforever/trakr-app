import React, { Component } from 'react';
import '../assets/stylesheets/expense.scss';

export default class Expense extends Component {
  constructor(props){
    super(props);

    this.state = {
      showOptions: false,
    }
  }

  render(){
    const { expense } = this.props;

    return(
      <div 
        className={this.getClass(expense.new)} 
        key={expense.id} 
      >
        <div className="spending-info-wrapper">
          <div className="amount-section">
            <span className="amount">${expense.amount}</span> 
          </div>
          <div className="spending-info">
            <div className="category">{expense.category}</div>
            <div>{expense.description || "No description provided"}</div>
          </div>
        </div>

        {this.renderOptions(expense)}
      </div>
    )
  }

  renderOptions(expense){
    if(this.state.showOptions){
      return (
        <div className="options-button-wrapper">
          <button onClick={(e) => {this.props.editExpense(e, expense.id)}} className="cancel lnr lnr-pencil"></button>
          <button onClick={(e) => {this.props.deleteExpense(e, expense.id)}} className="cancel lnr lnr-trash"></button>
          <button onClick={(e) => this.toggleMenu(e) } className="cancel lnr lnr-cross-circle"></button>        
        </div>
      )
    } else {
      return (
        <button onClick={(e) => this.toggleMenu(e) }className="cancel lnr lnr-menu-circle"></button>
      )
    }
  }

  getClass(newExpense){
    let className = (newExpense !== undefined && newExpense) ? "one-expense new" : "one-expense";
    if (this.state.showOptions) {
      className += " stack-vertically"
    }

    return className;
  }

  toggleMenu(e){
    e.preventDefault();

    this.setState((prevState) => {
      return {
        showOptions: !prevState.showOptions,
      }
    })
  }
}
