import '../assets/stylesheets/stats.scss';
import OccurenceCalendar from './occurenceCalendar'

import React, { Component } from 'react';

class Stats extends Component {

  constructor(props){
    super(props);

    this.state = {
      currentCategory: ""
    }

    this.handleClick = this.handleClick.bind(this);
  }

  render(){
    return (
      <div className="stats card">
        <div className="spending-by-category">
          {this.renderSpendingByCategory()}
        </div>
      </div>
    )
  }

  renderSpendingByCategory(){
    let spending = {};

    this.props.expenses.forEach((expense) => {
      const category = expense.category;
      if(typeof(spending[category]) === 'undefined'){
        spending[category] = expense.amount;
      } else {
        spending[category] += expense.amount;  
      }
    })

    return (
      <div>
        {this.renderSpendingHeaders(this.props.expenses.length)}
        {this.renderSpendingTable(spending)}

        <OccurenceCalendar 
          expenses={this.props.expenses} 
          category={this.state.currentCategory}
        />
      </div>
    )
  }

  renderSpendingHeaders(countOfExpenses){
    if(!countOfExpenses){
      return <div>No expenses recorded this month</div>
    }


    return (
      <div className="one-category-row header">
        <span className="category-name">Category</span>
        <span className="category-amount">Sum</span>
        <span className="category-percentage">Budget %</span>
      </div>
    )
  }

  renderSpendingTable(spending){
    let spendingArray = Object.keys(spending).map((category) => {
      return {
        category: category,
        amount: Number(spending[category]),
      }
    }).sort((a, b) => (a.amount < b.amount) ? 1 : -1);

    return spendingArray.map((category) => {
      return (
        <div className="one-category-row" key={category.category}>
          <span className="category-name" onClick={() => this.handleClick(category.category)}>{category.category}</span>
          <span className="category-amount">${category.amount}</span>
          <span className="category-percentage">{this.percentage(category.amount)}%</span>
        </div>
      )
    })
  }

  handleClick(category){
    this.setState({
      currentCategory: category,
    })
  }

  percentage(amount){
    return Math.floor(amount/this.props.monthlyBudget * 1000)/10
  }

}

export default Stats;
