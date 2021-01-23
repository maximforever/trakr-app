import '../assets/stylesheets/charts.scss';

import React from 'react';
import { 
  VictoryArea, 
  VictoryAxis, 
  VictoryBar, 
  VictoryChart,
  VictoryContainer,
  VictoryLabel, 
  VictoryLine,
  VictoryLegend, 
  VictoryTheme 
} from 'victory';

export default function Charts(props) {
  return renderCharts(props);
} 

function renderCharts(props){
  let expensesByDay = aggregateDailyExpenses(props.currentMonthExpenses, props.daysThisMonth);
  let expensesByMonth = aggregateMonthlyExpenses(props.currentYearExpenses, props.displayYear);

  const noDailyData = noExpensesSection(props.category, "month");
  const noMonthlyData = noExpensesSection(props.category, "year");
  const dailySpendingChart = props.currentMonthExpenses.length ? renderDailySpendingChart({...props, expenses: expensesByDay}) : noDailyData;
  const monthlySpendingChart = props.currentYearExpenses.length ? renderMonthlySpendingChart({...props, expenses: expensesByMonth}) : noMonthlyData;

  return (
    <div className="charts">
      {dailySpendingChart}
      {monthlySpendingChart}
    </div>
  )
}

function renderMonthlySpendingChart({expenses, daysThisMonth, monthlyBudget, category, displayYear}){
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <div className="chart card opaque">
      <h3 className="chart-title">{monthlyChartTitle(category, displayYear)}</h3>
      <VictoryChart 
        title={monthlyChartTitle(category)} 
        theme={VictoryTheme.material}
        maxDomain={{ x: 12 }}
        domainPadding={30}
        containerComponent={
          <VictoryContainer
            style={{
              pointerEvents: "auto",
              userSelect: "auto",
              touchAction: "auto"
            }}
          />
        }
      >

        <VictoryAxis 
          tickCount={13}
          style={{
            tickLabels: { 
              fontSize: 10,
            },
          }}
          tickFormat={(x) => (months[x])}
        />

        <VictoryAxis
          dependentAxis
          tickFormat={(x) => (`$${x}`)}
        />

        <VictoryBar
          alignment="start"
          data={expenses}  
          labels={({ datum }) => datum.amount > 0 ? `$${datum.amount}` : "" }
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
      </VictoryChart>
    </div>
  )
}

function renderDailySpendingChart({expenses, daysThisMonth, monthlyBudget, category}){
  return (
    <div className="chart card opaque">
      <h3 className="chart-title">{dailyChartTitle(category)}</h3>
      <VictoryChart 
        title={dailyChartTitle(category)}
        domainPadding={30} 
        theme={VictoryTheme.material}
        maxDomain={{ x: 31, y: calculateHighestChartValue(expenses, monthlyBudget, daysThisMonth)}}
        containerComponent={
          <VictoryContainer
            style={{
              pointerEvents: "auto",
              userSelect: "auto",
              touchAction: "auto"
            }}
          />
        }      
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
          tickCount={Math.floor(daysThisMonth/2)}
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
          data={expenses}  
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
            {x: 0, y: averageSpending(expenses)},
            {x: daysThisMonth, y: averageSpending(expenses)}
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

function aggregateDailyExpenses(expenses, daysThisMonth){
  let expensesByDay = [];

  for(let i=1; i <= daysThisMonth; i++){
    let totalSpending = 0;

    expenses.forEach((expense) => {
      const parsedDate = new Date(expense.timestamp);
      const expenseDate = parsedDate.getDate()

      if(expenseDate === i){
        totalSpending += expense.amount;
      }
    });

    expensesByDay.push({
      amount: totalSpending,
      date: i,
    })
  }

  return expensesByDay;
}

// TODO: we're iterating over expenses twice. we should combine this with iterating over daily expenses
// TODO: also, let's not use a for loop
function aggregateMonthlyExpenses(expenses, currentYear){
  let expensesByMonth = [];

  for(let i=0; i <= 11; i++){
    let totalSpending = 0;

    expenses.forEach((expense) => {
      const parsedDate = new Date(expense.timestamp);
      const expenseMonth = parsedDate.getMonth();
      const expenseYear = parsedDate.getYear() + 1900;

      if(expenseMonth === i && expenseYear === currentYear){
        totalSpending += expense.amount;
      }
    });

    expensesByMonth.push({
      amount: totalSpending,
      month: i,
    })
  }

  return expensesByMonth;
}


function calculateHighestChartValue(formattedExpenses, monthlyBudget, daysThisMonth){
  const expenses = formattedExpenses.map((expense) => expense.amount);
  const highestExpense = Math.max(...expenses);

  // limit the chart at eiher the allowed 1.1 daily spending (for space) or the highest expense
  return Math.max(dailyBalance(daysThisMonth, monthlyBudget) * 1.1, highestExpense *1.1);
}

function dailyBalance(daysThisMonth, monthlyBudget){
  return Math.round(monthlyBudget/daysThisMonth);
}

function averageSpending(days){
  let spending = days.map((day) => {
    return day.amount ? day.amount : '';
  });

  spending = spending.filter((day) =>{ 
    return day !== "";
  })

  const averageSpending = spending.reduce((a, b) => (a + b)) / spending.length;

  return Math.round(averageSpending);
}

function noExpensesSection(category, period){
  const categoryWording = category === "all" ? "" : category;

  return <div className="chart card opaque">There are no recorded {categoryWording} expenses this {period}</div>
}

function dailyChartTitle(category){
  return `Daily spending` + (category === "all" ? "" : ` on ${category}`)
}

function monthlyChartTitle(category, year){
  return `Month-over-month spending` + (category === "all" ? "" : ` on ${category}`) + ` in ${year}`;
}