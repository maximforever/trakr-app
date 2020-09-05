import '../assets/stylesheets/charts.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme } from 'victory';

export default function Charts({data}) {

  if(!data.length){
    return "no data yet..."
  }

  let dataWithDate = data.map((d) => {
    const parsedDate = new Date(d.timestamp);
    const createdAtDate = parsedDate.getDate()
    return {
      ...d,
      date: createdAtDate,
    }
  })

  return (
    <div className="chart">
      <VictoryChart 
        domainPadding={30} 
        theme={VictoryTheme.material}
        //range={{x: [1, 31]}}
      >
        <VictoryAxis
          tickFormat={(x) => (`${x}`)}
        />
        <VictoryAxis
          dependentAxis
          tickFormat={(x) => (`$${x}`)}
        />

        <VictoryBar
          padding={{right: 5, left: 5}}
          barWidth={12}
          categories={{
            x: [1,2,3,4,5]
          }}


          data={dataWithDate}
          labels={({ datum }) => `$${datum.amount}`}
          // data accessor for x values
          x="date"
          // data accessor for y values
          y="amount"
        />


      </VictoryChart>

    </div>
  )
} 