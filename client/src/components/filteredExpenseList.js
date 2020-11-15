import Expense from './expense';
import ExpenseFilter from './expenseFilter';
import ExpenseList from './expenseList';
import React, { Component } from 'react';
import '../assets/stylesheets/filteredExpenseList.scss';

export default class FilteredExpenseList extends Component {
  constructor(props){
    super(props);

    this.state = {
      filteredCategory: "",
      filteredDescription: "",
      filteredMinAmount: 0,
      filteredMaxAmount: Infinity,
    }

    this.updateCategory = this.updateCategory.bind(this);
  }

  render(){
    return (
      <div>
        <ExpenseFilter 
          updateCategory = {(newValue) => this.updateCategory(newValue)}
          updateDescription = {(newValue) => this.updateDescription(newValue)}
        />
        <ExpenseList 
          expenses = {this.filteredExpenses()} 
          deleteExpense={this.deleteExpense}
          editExpense={this.editExpense}
        />
      </div>
    )
  }

  filteredExpenses(){
    if(!this.state.filteredCategory.length && !this.state.filteredDescription.length ){ return this.props.expenses }

    return this.props.expenses.filter((expense) => {
      return (
        expense.category.includes(this.state.filteredCategory) &&
        expense.description.includes(this.state.filteredDescription)
      ) 
    });
  }

  updateCategory(filteredCategory){
    this.setState({ filteredCategory });
  }

  updateDescription(filteredDescription){
    this.setState({ filteredDescription });
  }
}