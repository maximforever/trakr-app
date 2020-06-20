import React, { Component } from 'react';
import '../assets/stylesheets/dashboard.scss';


class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.moneySpentToday = this.moneySpentToday.bind(this);
    this.moneySpentThisMonth = this.moneySpentThisMonth.bind(this);
    this.dailyBudget = this.dailyBudget.bind(this);
    this.monthlyBalance = this.monthlyBalance.bind(this);
  }

  render() {
    return(
      <div className="dashboard">
        <div className={`square full-square card ${this.getMetricClass(this.leftToSpendToday())}`}>
          <div className="label">Left to spend</div>
          <div className="metric">
            {this.moneyFormat(this.leftToSpendToday())}
          </div>
        </div>
        <div className="half-square-wrapper">
          <div className={`card square half-square ${this.getMetricClass(this.moneySpentToday())}`}>
            <div className="label">Spent today</div>
            <div className="metric">
              {this.moneyFormat(this.moneySpentToday())}
            </div>
          </div>
          <div className={`card square half-square ${this.getMetricClass(this.monthlyBalance())}`}>
            <div className="label">Monthly balance</div>
            <div className="metric">{this.moneyFormat(this.monthlyBalance())} <span className="submetric">/(${this.moneySpentThisMonth()})</span></div>
          </div>
        </div>
      </div>
    )
  }

  moneySpentToday(){
    return this.props.expenses.reduce((acc, expense) => {
      return (this.isToday(new Date(), expense.timestamp)) ? (acc + expense.amount) : acc;
    }, 0);
  }

  moneySpentThisMonth(){
    return this.props.expenses.reduce((acc, expense) => {
      return (this.isThisMonth(new Date(), expense.timestamp)) ? acc + expense.amount : acc;
    }, 0)
  }

  isToday(today, timestamp){
    timestamp = new Date(timestamp);
    return (
      today.getYear() === timestamp.getYear() && 
      today.getMonth() === timestamp.getMonth() && 
      today.getDate() === timestamp.getDate()
    )
  }

  isThisMonth(today, timestamp){
    timestamp = new Date(timestamp);
    return (
      this.props.currentDate.year === timestamp.getYear() + 1900 && 
      this.props.currentDate.month === timestamp.getMonth() + 1
    )
  }

  leftToSpendToday(){
    return this.dailyBudget() - this.moneySpentToday();
  }

  monthlyBalance(){
    let today = new Date();
    return this.dailyBudget()*today.getDate() - this.moneySpentThisMonth();
  }

  monthProgress(){
    const d = new Date();
    return Math.floor(d.getDate()/this.daysInMonth(d.getMonth(), d.getYear())*100);
  }

  dailyBudget(){
    const d = new Date();
    return Math.floor(this.props.monthlyBudget/this.daysInMonth(d.getMonth(), d.getYear()));
  }

  daysInMonth (month, year) {
    return new Date(year, month + 1, 0).getDate();
  }

  moneyFormat(number){
    return (number >= 0) ? `$${number}` : `-$${Math.abs(number)}`
  }

  getMetricClass(amount){
    return amount < 0 ? 'negative' : '';
  }
}

export default Dashboard;
