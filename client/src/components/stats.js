import '../assets/stylesheets/stats.scss';
import OccurenceCalendar from './occurenceCalendar'

import React, { Component } from 'react';

class Stats extends Component {

  constructor(props){
    super(props);

    this.state = {
      currentCategory: "all"
    }

    this.handleClick = this.handleClick.bind(this);
  }

  render(){
    return (
      <div className="stats card">
        <div className="spending-by-category">
          {this.renderSpendingByCategory()}
          {this.renderOccurenceCalendar()}
        </div>
      </div>
    )
  }

  renderSpendingByCategory(){
    let spending = this.sortExpensesByCategory();

    return (
      <div>
        {this.renderSpendingHeaders(this.props.expenses.length)}
        {this.renderSpendingTable(spending)}
      </div>
    )
  }

  renderOccurenceCalendar(){
    return <OccurenceCalendar 
      currentDate={this.props.currentDate}
      expenses={this.props.expenses} 
      category={this.state.currentCategory}
    />
  }

  renderSpendingHeaders(countOfExpenses){
    if(!countOfExpenses){
      return <div>No expenses recorded this month</div>
    }


    return (
      <div className="category-name-row">
        <span className="category-header-name">Category</span>
        <span className="category-amount">Sum</span>
        <span className="category-percentage">Budget %</span>
      </div>
    )
  }

  renderSpendingTable(spending){
    if(!Object.keys(spending).length){ return }

    let spendingArray = [{
      category: "all",
      amount: this.sumOfAllExpenses(),
    }].concat(
      Object.keys(spending).map((category) => {
        return {
          category: category,
          amount: Number(spending[category]),
        }
      }).sort((a, b) => (a.amount < b.amount) ? 1 : -1)
    );

    return spendingArray.map((category) => {
      return (
        <div className="one-category-row" 
          key={category.category}
          onClick={() => this.handleClick(category.category)}
        >
          <span className="category-name">{category.category}</span>
          <span className="category-amount">${category.amount}</span>
          <span className="category-percentage">{this.percentage(category.amount)}%</span>
        </div>
      )
    })
  }

  sortExpensesByCategory(){
    let spending = {};
    this.props.expenses.forEach((expense) => {
      const category = expense.category;
      if(typeof(spending[category]) === 'undefined'){
        spending[category] = expense.amount;
      } else {
        spending[category] += expense.amount;  
      }
    });

    return spending;
  }

  handleClick(category){
    this.setState({
      currentCategory: category,
    })
  }

  percentage(amount){
    return Math.floor(amount/this.props.monthlyBudget * 1000)/10
  }

  sumOfAllExpenses(){
    return this.props.expenses.reduce((acc, expense) => {
      return acc + expense.amount;
    }, 0)
  }

}

export default Stats;
