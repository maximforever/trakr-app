import Expense from './expense';
import ExpenseFilter from './expenseFilter';
import React, { Component } from 'react';
import '../assets/stylesheets/expenseList.scss';


export default class ExpenseList extends Component {
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
        <h3 className="expense-heading">Expenses</h3>
        <ExpenseFilter 
          updateCategory = {(newValue) => this.updateCategory(newValue)}
          updateDescription = {(newValue) => this.updateDescription(newValue)}
        />
        {this.renderExpenses(this.filteredExpenses(), this.props.deleteExpense, this.props.editExpense)}
      </div>
    )
  }

  renderExpenses(expenses, deleteExpense, editExpense){
    if (!expenses.length){ return <p>No expenses recorded this month - you should add one!</p> }

    const uniqueSortedDates = this.getUniqueSortedDates(expenses);

    return uniqueSortedDates.map((date) => {
      const expensesOnThisDate = this.getExpensesOnThisDate(expenses, date)
      const expenseElements = this.expensesElements(expensesOnThisDate, date, deleteExpense, editExpense);
      const spentThisDay = this.moneySpentThisDay(expensesOnThisDate);

      return(
        <div className="day-of-expenses" key={date}>
          <div className="date-header">
            <span>{date}</span>
            <span className="daily-spending-total">${spentThisDay}</span>
          </div>
          { expenseElements }
        </div>
      )
    })
  }

  expensesElements(expenses, date, deleteExpense, editExpense){
    return expenses.map((expense) => {
      return (<Expense 
                key={expense.id}
                expense={expense} 
                deleteExpense={deleteExpense}
                editExpense={editExpense}
              />)
    })
  }

  getExpensesOnThisDate(expenses, date){
    return expenses.filter((expense)=> {
      return this.readableDate(expense.timestamp) === date;
    })
  }

  getUniqueSortedDates(expenses) {
    expenses = expenses.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    const dates = expenses.map((expense) => {
      return this.readableDate(expense.timestamp);
    });

    return [...new Set(dates)];
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

  moneySpentThisDay(expenses){
    return expenses.reduce((acc, expense) => {
      return acc + expense.amount;
    }, 0);
  }

  readableDate(dateString){
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const dateComponents = dateString.substring(0, 10).split("-");
    return`${months[Number(dateComponents[1]) - 1]} ${dateComponents[2]}, ${dateComponents[0]}`
  }

}