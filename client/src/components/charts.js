import '../assets/stylesheets/charts.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import { VictoryBar, VictoryLine, VictoryChart, VictoryAxis, VictoryTheme } from 'victory';

export default function Charts({expenses, daysThisMonth, monthlyBudget}) {

  if(!expenses.length){
    return "no data yet..."
  }

  let formattedExpenses = aggregateExpenses(expenses, daysThisMonth);

  return (
    <div className="chart card opaque">
      <VictoryChart 
        domainPadding={30} 
        theme={VictoryTheme.material}
        //maxDomain={{ x: 31, y: averageSpending(formattedExpenses) * 1.5}}
        //range={{x: [1, 31]}}
      >
        <VictoryAxis />
        <VictoryAxis
          dependentAxis
          tickFormat={(x) => (`$${x}`)}
        />

        <VictoryBar
          barRatio={0.5}
          style={{ labels: { fontSize: "10px" } }}
          data={formattedExpenses}  
          labels={({ datum }) => { 
            return datum.amount ? `$${datum.amount}` : ''
          }}
          x="date"
          y="amount"
        />

         <VictoryLine 
          data={[
            {x: 0, y: dailyBalance(daysThisMonth, monthlyBudget)},
            {x: daysThisMonth, y: dailyBalance(daysThisMonth, monthlyBudget)}
          ]}
          style={{
            data: {
              stroke: "#e47575",
            },
            labels: {
              fill: "#e47575",
            }
          }}
          labels={({ datum }) => {
            if(datum.x) { return `daily budget: $${datum.y}`} } 
          }
         />

         <VictoryLine 
          data={[
            {x: 0, y: averageSpending(formattedExpenses)},
            {x: daysThisMonth, y: averageSpending(formattedExpenses)}
          ]}
          style={{
            data: {
              stroke: "#1d82ff",
            },
            labels: {
              fill: "#1d82ff",
            }
          }}
          labels={({ datum }) => {
            if(datum.x) { return `average: $${datum.y}`} } 
          }
         />

      </VictoryChart>
    </div>
  )
} 

function aggregateExpenses(expenses, daysThisMonth){
  let formattedExpenses = [];

  for(let i=1; i <= daysThisMonth; i++){
    let totalSpending = 0;

    expenses.forEach((expense) => {
      const parsedDate = new Date(expense.timestamp);
      const createdAtDate = parsedDate.getDate()

      if(createdAtDate === i){
        totalSpending += expense.amount;
      }
    });

    formattedExpenses.push({
      amount: totalSpending,
      date: i,
    })
  }

  return formattedExpenses;
}

function dailyBalance(daysThisMonth, monthlyBudget){
  return Math.floor(monthlyBudget/daysThisMonth);
}

function averageSpending(days){
  let spending = days.map((day) => {
    return day.amount ? day.amount : '';
  });

  spending = spending.filter((day) =>{ 
    return day !== "";
  })

  const averageSpending = spending.reduce((a, b) => (a + b)) / spending.length;

  return Math.floor(averageSpending);
}