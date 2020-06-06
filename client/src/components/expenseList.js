import React from 'react';
import Expense from './expense';
import '../assets/stylesheets/expenseList.scss';

function ExpenseList(props){
/* TODO: implement dispaying expenses by month */

  return (
    <div>
      <h3 className="expense-heading">Expenses:</h3>
      {renderExpenses(props.expenses, props.deleteExpense, props.editExpense)}
    </div>
  )
}

function renderExpenses(expenses, deleteExpense, editExpense){
  if (!expenses.length){ return <p>No expenses recorded this month - you should add one!</p> }

  const uniqueSortedDates = getUniqueSortedDates(expenses);

  return uniqueSortedDates.map((date) => {
    const expensesOnThisDate = getExpensesOnThisDate(expenses, date)
    const expenseElements = expensesElements(expensesOnThisDate, date, deleteExpense, editExpense);
    const spentThisDay = moneySpentThisDay(expensesOnThisDate);

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

function expensesElements(expenses, date, deleteExpense, editExpense){
  return expenses.map((expense) => {
    return (<Expense 
            key={expense.id}
            expense={expense} 
            deleteExpense={deleteExpense}
            editExpense={editExpense}
          />)
  })
}

function getExpensesOnThisDate(expenses, date){
  return expenses.filter((expense)=> {
    return readableDate(expense.timestamp) === date;
  })
}

function getUniqueSortedDates(expenses) {
  expenses = expenses.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const dates = expenses.map((expense) => {
    return readableDate(expense.timestamp);
  });

  return [...new Set(dates)];
}

function moneySpentThisDay(expenses){
  return expenses.reduce((acc, expense) => {
    return acc + expense.amount;
  }, 0);
}

function readableDate(dateString){
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const dateComponents = dateString.substring(0, 10).split("-");
  return`${months[Number(dateComponents[1]) - 1]} ${dateComponents[2]}, ${dateComponents[0]}`
}

export default ExpenseList;
