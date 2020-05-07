import React from 'react';
import '../assets/stylesheets/expense.scss';

function Expense(props){
  const { expense } = props;

  return (
    <div className="one-expense" key={expense.id}>
      <div>
        <div className="category">{expense.category}</div>
        <div><strong>${expense.amount}</strong> for {expense.description || "Undefined"}</div>
      </div>
      <div onClick={() => { props.deleteExpense(expense.id)}}className="lnr lnr-cross-circle"></div>
    </div>
  )
}

export default Expense;
