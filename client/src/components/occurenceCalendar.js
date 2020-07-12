import '../assets/stylesheets/occurenceCalendar.scss';

import React from 'react';

function OccurenceCalendar(props){
  return (
    <div className="occurence-calendar">
      <h3>{ props.category }</h3>
      <div className="cell-wrapper">
        {renderCells(props)}
      </div>
    </div>
  )
}

function renderCells(props) {
  const { currentDate } = props; 
  const daysThisMonth = daysInMonth(currentDate.month, currentDate.year);
  const daysToRoundOutRow = 7 - daysThisMonth%7;
  let cells = [];

  for(let i=1; i<=daysThisMonth; i++){

    const matchingExpenses = props.expenses.filter((expense) => {
      const expenseBelongsToSelectedCategory = props.category === "all" || (props.category === expense.category);
      return i === getDay(expense.timestamp) && expenseBelongsToSelectedCategory;
    })

    const thisClass = matchingExpenses.length ? "cell has-spending  " : "cell";

    cells.push(<div className={thisClass} key={i}>{i}</div>);      
  }

  for(let i=1; i<=daysToRoundOutRow; i++){
    cells.push(<div className='cell invisible' key={`invisible-${i}`}></div>);
  }

  return cells;
}

function daysInMonth(month, year) {
  return new Date(year, month, 0).getDate();
}

function getDay(date){
  const timestamp = new Date(date);
  // this corrects the timestamp timezone
  timestamp.setHours(timestamp.getHours() + timestamp.getTimezoneOffset()/60)

  return timestamp.getDate();
}

export default OccurenceCalendar;
