import '../assets/stylesheets/charts.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import { VictoryBar, VictoryLine, VictoryChart, VictoryAxis, VictoryTheme } from 'victory';

export default function Charts({data, daysThisMonth, monthlyBudget}) {

  if(!data.length){
    return "no data yet..."
  }

  let formattedData = aggregateExpenseData(data, daysThisMonth);

  return (
    <div className="chart card opaque">
      <VictoryChart 
        domainPadding={30} 
        theme={VictoryTheme.material}
        maxDomain={{ x: 31, y: dailyBalance(daysThisMonth, monthlyBudget) * 2}}
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
          data={formattedData}  
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
            if(datum.x) { return `$${datum.y}`} } 
          }
         />

      </VictoryChart>
    </div>
  )
} 

function aggregateExpenseData(data, daysThisMonth){
  let formattedData = [];

  for(let i=1; i <= daysThisMonth; i++){
    let totalSpending = 0;

    data.forEach((expense) => {
      const parsedDate = new Date(expense.timestamp);
      const createdAtDate = parsedDate.getDate()

      if(createdAtDate === i){
        totalSpending += expense.amount;
      }
    });

    formattedData.push({
      amount: totalSpending,
      date: i,
    })
  }

  return formattedData;
}

function dailyBalance(daysThisMonth, monthlyBudget){
  return Math.floor(monthlyBudget/daysThisMonth);
}