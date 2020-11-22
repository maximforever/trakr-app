import '../assets/stylesheets/spendingStatistics.scss';

import React from 'react';

export default function SpendingStatistics(props){

  if(!props.expenses.length){
    if(!props.expenses.length){
      return <div className="chart card opaque">Not enough expense data to render chart</div>
    }
  }


  return (
    <div className="card opaque">
      <h3>{getStatisticsTitle(props.category)}</h3>
      <div className="one-statistic">
        <span className="name">Total purchases</span> 
        <span className="value">{props.expenses.length}</span>
      </div>

      <div className="one-statistic">
        <span className="name">Average purchase</span> 
        <span className="value">${getAverageSpending(props.expenses)}</span>
      </div>

      <div className="one-statistic">
        <span className="name">Average spending per day</span> 
        <span className="value">${getSpendingPerDay(props.expenses, props.daysThisMonth)}</span>
      </div>

      <div className="one-statistic">
        <span className="name">Average purchases per day</span> 
        <span className="value">{getAverageOccurence(props.expenses, props.daysThisMonth)}</span>
      </div>
    </div>
  )
}

function getStatisticsTitle(category){
  return "Quick stats on " + (category === "all" ? " all spending" : ` ${category}`)
}

function getAverageSpending(expenses){
  if(!expenses.length) { return formatAmount(0); }

  return formatAmount(sumOfAllExpenses(expenses)/expenses.length);
}

function getSpendingPerDay(expenses, daysThisMonth){
  // if this is a past month, we need to account for days in the past month
  // if it's a current month, we count days till now

  const currentDate = new Date();
  const expenseDate = new Date(expenses[0].timestamp);

  if(currentDate.getMonth() === expenseDate.getMonth() && currentDate.getYear() === expenseDate.getYear()){
    return formatAmount(sumOfAllExpenses(expenses)/currentDate.getDate());
  }

  return formatAmount(sumOfAllExpenses(expenses)/daysThisMonth);
}

function getAverageOccurence(expenses, daysThisMonth) {
  // if this is a past month, we need to account for days in the past month
  // if it's a current month, we count days till now

  const currentDate = new Date();
  const expenseDate = new Date(expenses[0].timestamp);

  if(currentDate.getMonth() === expenseDate.getMonth() && currentDate.getYear() === expenseDate.getYear()){
    return Math.floor(expenses.length/currentDate.getDate() * 10)/10;
  }

  return Math.floor(expenses.length/daysThisMonth * 10)/10;
}

function sumOfAllExpenses(expenses){
  return expenses.reduce((acc, expense) => {
    return acc + expense.amount
  }, 0);
}

function formatAmount(amount){
  return (Math.round(amount * 100)/100).toFixed(2);
}