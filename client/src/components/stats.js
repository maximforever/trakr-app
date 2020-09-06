import '../assets/stylesheets/stats.scss';
import OccurenceCalendar from './occurenceCalendar'
import Charts from './charts'

import React, { Component } from 'react';

class Stats extends Component {

  constructor(props){
    super(props);

    this.state = {
      currentCategory: "all",
      daysThisMonth: this.daysInMonth(this.props.currentDate.month, this.props.currentDate.year)
    }

    this.handleClick = this.handleClick.bind(this);
  }

  render(){
    return (
      <div className="stats card">
        <div className="spending-by-category">
          {this.renderSpendingByCategory()}
          {this.renderOccurenceCalendar()}
          {this.renderStats()}
        </div>
      </div>
    )
  }

  renderSpendingByCategory(){
    let spending = this.sortExpensesByCategory();

    return (
      <div>
        {this.renderSpendingHeaders(this.props.expenses.length)}
        {this.renderTableOfSpendingByCategory(spending)}
      </div>
    )
  }

  renderOccurenceCalendar(){
    return <OccurenceCalendar 
      daysThisMonth={this.state.daysThisMonth}
      expenses={this.props.expenses} 
      category={this.state.currentCategory}
    />
  }

  renderStats(){
    return <Charts 
      data={this.props.expenses}
      daysThisMonth={this.state.daysThisMonth}
    />
  }

  renderSpendingHeaders(countOfExpenses){
    if(!countOfExpenses){
      return <div>No expenses recorded this month</div>
    }


    return (
      <div className="category-header-row">
        <span className="category-name">Category</span>
        <span className="category-amount">Sum</span>
        <span className="category-percentage">%</span>
      </div>
    )
  }

  renderTableOfSpendingByCategory(spending){
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
        <div className={this.getCategoryRowClass(category.category)}
          key={category.category}
          onClick={() => this.handleClick(category.category)}
        >
          <span className="category-name">{category.category}</span>
          <span className="category-amount">${category.amount}</span>
          <span className="category-percentage">{this.percentageOfMonthlySpending(category.amount)}%</span>
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

  percentageOfMonthlySpending(amount){
    return Math.floor(amount/this.sumOfAllExpenses() * 1000)/10
  }

  sumOfAllExpenses(){
    return this.props.expenses.reduce((acc, expense) => {
      return acc + expense.amount;
    }, 0)
  }

  getCategoryRowClass(category){
    return "one-category-row" + (this.state.currentCategory === category ?  " selected" : "");
  }

  daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }

}

export default Stats;
