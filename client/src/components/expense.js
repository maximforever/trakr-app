import React from 'react';
import '../assets/stylesheets/expense.scss';

function Expense(props){
  const { expense } = props;
    
  return(
    <div className={getClass(expense.new)} key={expense.id}>
      <div className="spending-info-wrapper">
        <div className="amount-section">
          <span className="amount">${expense.amount}</span> 
        </div>
        <div className="spending-info">
          <div className="category">{expense.category}</div>
          <div>{expense.description || "Undefined"}</div>
        </div>
      </div>
      <button onClick={(e) => {props.editExpense(e, expense.id)}}className="cancel lnr lnr-pencil"></button>
      <button onClick={(e) => {props.deleteExpense(e, expense.id)}}className="cancel lnr lnr-cross-circle"></button>
    </div>
  )
}

function getClass(newExpense){
  return (newExpense !== "undefined" && newExpense) ? "one-expense new" : "one-expense";
}

export default Expense;
