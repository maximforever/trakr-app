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
        <h3 className="expense-heading" id="expense-section-heading">Expenses</h3>
        <ExpenseFilter 
          updateCategory = {(newValue) => this.updateCategory(newValue)}
          updateDescription = {(newValue) => this.updateDescription(newValue)}
          categories = {this.getExpenseCategories()}
        />
        <ExpenseList 
          expenses = {this.filteredExpenses()} 
          deleteExpense={this.props.deleteExpense}
          editExpense={this.props.editExpense}
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

  getExpenseCategories(){
    return [...new Set(this.props.expenses.map((e) => e.category))]
  }

  updateCategory(filteredCategory){
    this.setState({ filteredCategory });
  }

  updateDescription(filteredDescription){
    this.setState({ filteredDescription });
  }
}