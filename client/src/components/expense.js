import React from 'react';
import '../assets/stylesheets/expense.scss';

function Expense(props){
  const { expense } = props;
    
  return(
    <div className={getClass(expense.new)} key={expense.id} onClick={() => {props.editExpense(expense.id)}}>
      <div>
        <div className="category">{expense.category}</div>
        <div><strong>${expense.amount}</strong> for {expense.description || "Undefined"}</div>
      </div>
      <div onClick={(e) => {props.deleteExpense(e, expense.id)}}className="lnr lnr-cross-circle"></div>
    </div>
  )
}

function getClass(newExpense){
  return (newExpense !== "undefined" && newExpense) ? "one-expense new" : "one-expense";
}

export default Expense;
