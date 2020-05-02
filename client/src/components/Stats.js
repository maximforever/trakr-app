import '../assets/stylesheets/stats.scss';

import React, { Component } from 'react';

class Stats extends Component {

  constructor(props){
    super(props);

    // TODO: not sure if we need state here at all
    this.state = {}
  }

  componentDidMount(){
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
        <div className="one-category-row header">
          <span className="category-name">Category</span>
          <span className="category-amount">Sum</span>
          <span className="category-percentage">Budget %</span>
        </div>

        {this.renderSpendingTable(spending)}
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
          <span className="category-name">{category.category}</span>
          <span className="category-amount">${category.amount}</span>
          <span className="category-percentage">{this.percentage(category.amount)}%</span>
        </div>
      )
    })
  }

  percentage(amount){
    return Math.floor(amount/this.props.monthlyBudget * 1000)/10
  }

}

export default Stats;
