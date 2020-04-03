import React from 'react';

const Expenses = (props) => {
  return (
    <div>
      <h3>Expenses:</h3>
      { renderExpenses(props.expenses) }
    </div>
  )
}

function renderExpenses(expenses){
  return expenses.map((expense) => {
    return (
      <div className="one-expense" key={expense.id}>
        <strong>{expense.amount}</strong> for {expense.description || "Undefined"}
      </div>
    )
  })
}

export default Expenses;
