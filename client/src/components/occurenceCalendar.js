import '../assets/stylesheets/occurenceCalendar.scss';

import React from 'react';

export default function OccurenceCalendar(props){
  return (
    <div className="card opaque occurence-calendar">
      <h3>{getCalendarTitle(props.category)}</h3>
      <div className="cell-wrapper">
        {renderCells(props)}
      </div>
    </div>
  )
}

function renderCells(props) {
  const daysToRoundOutRow = 7 - props.daysThisMonth%7;
  let cells = [];

  for(let i=1; i <= props.daysThisMonth; i++){
    const todaysExpenses = props.expenses.filter((expense) => i === getDay(expense.timestamp))
    const thisClass = todaysExpenses.length ? "cell has-spending  " : "cell";
    cells.push(<div className={thisClass} key={i}>{i}</div>);      
  }

  for(let i=1; i<=daysToRoundOutRow; i++){
    cells.push(<div className='cell invisible' key={`invisible-${i}`}></div>);
  }

  return cells;
}

function getDay(date){
  const timestamp = new Date(date);
  // this corrects the timestamp timezone
  timestamp.setHours(timestamp.getHours() + timestamp.getTimezoneOffset()/60)

  return timestamp.getDate();
}

function getCalendarTitle(category){
  return "Days I bought" + (category === "all" ? " anything" : ` ${category}`)
}