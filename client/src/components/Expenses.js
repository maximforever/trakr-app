import React from 'react';

function Expenses(props){
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
        <a href="#" onClick={() => { deleteExpense(expense.id)}}>delete</a>
      </div>
    )
  })
}

export default Expenses;
