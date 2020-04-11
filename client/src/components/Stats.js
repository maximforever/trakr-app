import '../assets/stylesheets/Stats.scss';

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
        <div className="card spending-by-category">
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

    return Object.keys(spending).map((category) => {
      return (
        <div className="one-category-stat" key={category}>
          <span className="category-name">{category}</span>
          <span className="category-amount">${spending[category]}</span>
        </div>
      )
    })
  }

}

export default Stats;
