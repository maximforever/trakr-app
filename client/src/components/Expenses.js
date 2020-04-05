import React from 'react';
import '../assets/stylesheets/Expenses.scss';

function Expenses(props){
/* TODO: implement this!*/
/*  if(props.expenses.length){
    const timestamps = props.expenses.map((e) => `${e.timestamp}, ${e.description}` )
    console.log(timestamps);
  }*/

  return (
    <div>
      <h3>Expenses:</h3>
      { renderExpenses(props.expenses, props.deleteExpense) }
    </div>
  )
}

function renderExpenses(expenses, deleteExpense){
  return expenses.map((expense) => {
    return (
      <div className="one-expense" key={expense.id}>
        <span>
          <strong>${expense.amount}</strong> for {expense.description || "Undefined"}
        </span>
        <span onClick={() => { deleteExpense(expense.id)}}className="lnr lnr-cross-circle"></span>
      </div>
    )
  })
}

export default Expenses;
