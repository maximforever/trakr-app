import '../assets/stylesheets/spendingStatistics.scss';

import React from 'react';

export default function SpendingStatistics(props){
  if(!props.expenses.length){ return null }

  return (
    <div className="card opaque">
      <h3>{getStatisticsTitle(props.category)}</h3>
      <div className="one-statistic">
        <span className="name">Total purchases</span> 
        <span className="value">{props.expenses.length}</span>
      </div>

      <div className="one-statistic">
        <span className="name">Average $ per purchase</span> 
        <span className="value">${getAverageSpending(props.expenses)}</span>
      </div>

      <div className="one-statistic">
        <span className="name">Average $ per day</span> 
        <span className="value">${getSpendingPerDay(props.expenses, props.daysThisMonth)}</span>
      </div>

      <div className="one-statistic">
        <span className="name">Purchases per day</span> 
        <span className="value">{getPurchasesPerDay(props.expenses, props.daysThisMonth)}</span>
      </div>

      <div className="one-statistic">
        <span className="name">Average purchase is every</span> 
        <span className="value">{getAverageOccurence(props.expenses, props.daysThisMonth)} days</span>
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
  return formatAmount(sumOfAllExpenses(expenses)/uniquePurchaseDays(expenses));
}

function getAverageOccurence(expenses, daysThisMonth) {
  return Math.floor(daysInSelectedMonth(expenses[0], daysThisMonth)/uniquePurchaseDays(expenses) * 10)/10;
}

function getPurchasesPerDay(expenses, daysThisMonth) {
  return Math.floor(expenses.length/uniquePurchaseDays(expenses) * 10)/10;
}

function sumOfAllExpenses(expenses){
  return expenses.reduce((acc, expense) => {
    return acc + expense.amount
  }, 0);
}

function formatAmount(amount){
  return (Math.round(amount * 100)/100).toFixed(2);
}

function displayingCurrentMonth(expense){
  const currentDate = new Date();
  const expenseDate = new Date(expense.timestamp);

  return (currentDate.getMonth() === expenseDate.getMonth() && currentDate.getYear() === expenseDate.getYear())
}

function uniquePurchaseDays(expenses){
  const dates = expenses.map((expense) => {
    const parsedDate = new Date(expense.timestamp);
    return parsedDate.getDate();
  });

  return [...new Set(dates)].length
}

function daysInSelectedMonth(expense, daysThisMonth){
  // if this is a past month, we need to account for days in the past month
  // if it's a current month, we count days till now

  const currentDate = new Date();
  return displayingCurrentMonth(expense) ? currentDate.getDate() : daysThisMonth;
}