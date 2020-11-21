import '../assets/stylesheets/charts.scss';

import React from 'react';
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

export default function Charts({expenses, daysThisMonth, monthlyBudget, category}) {

  if(!expenses.length){
    return "no data yet..."
  }

  let formattedExpenses = aggregateExpenses(expenses, daysThisMonth);

  return (
    <div className="chart card opaque">
      <h3 className="chart-title">{getChartTitle(category)}</h3>
      <VictoryChart 
        title={getChartTitle(category)}
        domainPadding={30} 
        theme={VictoryTheme.material}
        maxDomain={{ x: 31, y: calculateHighestChartValue(formattedExpenses, monthlyBudget, daysThisMonth)}}
      >
        <VictoryLegend 
          x={45}
          gutter={30}
          orientation="horizontal"
          data={[
            { name: `Average spending`, symbol: { fill: "#e47575" } },
            { name: "Daily budget", symbol: { fill: "#1d82ff" } }
          ]}
          style={{
            labels: {
              fontSize: 12,
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
          }}
          data={[
            { x: 0, y: daysThisMonth},
            { x: 0, y: dailyBalance(daysThisMonth, monthlyBudget)},
            { x: daysThisMonth, y: dailyBalance(daysThisMonth, monthlyBudget)},
            { x: daysThisMonth, y: 0},
          ]}
        />

        <VictoryBar
          barRatio={0.7}
          data={formattedExpenses}  
          labels={({ datum }) => { 
            return ""// datum.amount ? `$${datum.amount}` : ''
          }}
          labelComponent={
            <VictoryLabel
              backgroundStyle={{ fill: "white", opacity: 0.6 }}
              backgroundPadding={{ left: 3, right: 4, }}
              style={[
                { 
                  fill: "rgb(69, 90, 100)",
                  fontSize: 9,
                  fontFamily: "sans-serif",
                },
              ]}
            />
          }
          x="date"
          y="amount"
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
          }}
          labelComponent={<VictoryLabel
            backgroundStyle={{ fill: "#e47575", opacity: 0.1 }}
            backgroundPadding={{ left: 3, right: 4, bottom: 1 }}
            style={[
              { 
                fill: "#e47575",
                fontSize: 11,
                fontFamily: "sans-serif",
              },
            ]}
            dx={-10}
          />}
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
              strokeDasharray: [5, 5],
            },
          }}
          labelComponent={<VictoryLabel
            backgroundStyle={{ fill: "#1d82ff", opacity: 0.1 }}
            backgroundPadding={{ left: 3, right: 4, bottom: 1 }}
            style={[
              { 
                fill: "#1d82ff",
                fontSize: 11,
                fontFamily: "sans-serif",
              },
            ]}
            dx={-10}
          />}
          labels={({ datum }) => {
            if(datum.x) { return `$${datum.y}`} } 
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

function getChartTitle(category){
  return "Daily spending" + (category === "all" ? "" : ` on ${category}`)
}