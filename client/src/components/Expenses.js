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
  if (!expenses.length){
    return <p>No expenses recorded yet - try adding one!</p>
  }


  return expenses.map((expense) => {
    return (
      <div className="one-expense" key={expense.id}>
        <div>
          <div className="category">{expense.category}</div>
          <div><strong>${expense.amount}</strong> for {expense.description || "Undefined"}</div>
        </div>
        <div onClick={() => { deleteExpense(expense.id)}}className="lnr lnr-cross-circle"></div>
      </div>
    )
  })
}

export default Expenses;
