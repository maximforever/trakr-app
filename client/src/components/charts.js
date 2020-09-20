import '../assets/stylesheets/charts.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import { 
  VictoryArea, 
  VictoryAxis, 
  VictoryBar, 
  VictoryChart,
  VictoryLabel, 
  VictoryLine,
  VictoryLegend, 
  VictoryTheme 
} from 'victory';

export default function Charts({expenses, daysThisMonth, monthlyBudget}) {

  if(!expenses.length){
    return "no data yet..."
  }

  let formattedExpenses = aggregateExpenses(expenses, daysThisMonth);

  return (
    <div className="chart card opaque">
      <h3 className="chart-title">Daily spending</h3>
      <VictoryChart 
        title={"Daily spending"}
        domainPadding={30} 
        theme={VictoryTheme.material}
        maxDomain={{ x: 31, y: calculateHighestChartValue(formattedExpenses, monthlyBudget, daysThisMonth)}}
      >
        <VictoryLegend 
          x={18}
          gutter={30}
          orientation="horizontal"
          data={[
            { name: "Average spending", symbol: { fill: "#e47575" } },
            { name: "Daily budget", symbol: { fill: "#1d82ff" } }
          ]}
          style={{
            labels: {
              fontSize: 16,
            }
          }}
        />

        <VictoryAxis 
          tickCount={daysThisMonth/2}
          style={{
            tickLabels: { 
              fontSize: 10,
            },
          }}
        />

        <VictoryAxis
          dependentAxis
          range={{x: [1, daysThisMonth]}}
          tickFormat={(x) => (`$${x}`)}
        />

        <VictoryArea
          style={{ 
            data: { fill: "rgb(29, 130, 255, 0.09)" },
            strokeWidth: 0,
            strokeDasharray: [5, 5],
          }}
          data={[
            { x: 0, y: daysThisMonth},
            { x: 0, y: dailyBalance(daysThisMonth, monthlyBudget)},
            { x: daysThisMonth, y: dailyBalance(daysThisMonth, monthlyBudget)},
            { x: daysThisMonth, y: 0},
          ]}
        />

        <VictoryLine 
          data={[
            {x: 0, y: averageSpending(formattedExpenses)},
            {x: daysThisMonth, y: averageSpending(formattedExpenses)}
          ]}
          style={{
            data: {
              stroke: "#e47575",
              strokeWidth: 1,
              strokeDasharray: [5, 5],
            },
            labels: {
              fill: "#e47575",
            }
          }}
          labels={({ datum }) => {
            if(datum.x) { return `$${datum.y}`} } 
          }
         />

        <VictoryLine 
          data={[
            {x: 0, y: dailyBalance(daysThisMonth, monthlyBudget)},
            {x: daysThisMonth, y: dailyBalance(daysThisMonth, monthlyBudget)}
          ]}
          style={{
            data: {
              stroke: "#1d82ff",
              strokeWidth: 1,
            },
            labels: {
              fill: "#1d82ff",
            }
          }}
          labels={({ datum }) => {
            if(datum.x) { return `$${datum.y}`} } 
          }
        />

        <VictoryBar
          barRatio={0.7}
          style={{ 
            labels: { 
              fontSize: 8,
              //angle: -45,
            } 
          }}
          data={formattedExpenses}  
          labels={({ datum }) => { 
            return datum.amount ? `$${datum.amount}` : ''
          }}
          labelComponent={
            <VictoryLabel
              backgroundStyle={{ fill: "white", opacity: 0.6 }}
              backgroundPadding={{ bottom: 1, top: 1, left: 3, right: 4, }}
            />
          }
          x="date"
          y="amount"
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

function calculateHighestChartValue(formattedExpenses, monthlyBudget, daysThisMonth){
  const expenses = formattedExpenses.map((expense) => expense.amount);
  const highestExpense = Math.max(...expenses);

  // limit the chart at eiher the allowed 1.1 daily spending (for space) or the highest expense
  return Math.max(dailyBalance(daysThisMonth, monthlyBudget) * 1.1, highestExpense *1.1);
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