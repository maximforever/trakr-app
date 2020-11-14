import '../assets/stylesheets/expenseFilter.scss';
import React from 'react';

export default function ExpenseFilter(props){
  return (
    <div className="card opaque">
      <h3>Filter by:</h3>
      <label>
        <input 
          type="text" 
          placeholder="Category" 
          onChange={(e) => {
            props.updateCategory(e.target.value.trim())
          }}>
        </input>
        <br />
      </label>

      <label>
        <input 
          type="text" 
          placeholder="Description" 
          onChange={(e) => {
            props.updateDescription(e.target.value.trim())
          }}>
        </input>
        <br />
      </label>
    </div>
  )
}