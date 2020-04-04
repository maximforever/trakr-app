import React, { Component } from 'react';
import '../assets/stylesheets/Dashboard.scss';


class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      moneySpentToday: this.moneySpentToday(),
    }

    this.moneySpentToday = this.moneySpentToday.bind(this);
    this.moneySpentThisMonth = this.moneySpentThisMonth.bind(this);
    this.dailyBudget = this.dailyBudget.bind(this);
  }
  
  render() {
    return(
      <div className="dashboard">
        <div className="square full-square card">
          <div className="label">Spent today:</div>
          <div className="metric">${this.state.moneySpentToday}</div>
        </div>
        <div className="half-square-wrapper">
          <div className="card square half-square">
            <div className="label">Left to spend</div>
            <div className="metric">${this.leftToSpendToday()}</div>
          </div>
          <div className="card square half-square">
            <div className="label">Monthly balance</div>
            <div className="metric">{this.monthProgress()}%</div>
          </div>
        </div>
      </div>
    )
  }

  moneySpentToday(){
    console.log(this.props.expenses);
    return this.props.expenses.reduce((acc, expense) => {
      if(this.isToday(expense.created_at)){
        return acc + expense.amount;
      }
    }, 0)
  }

  moneySpentThisMonth(){
    console.log(this.props.expenses.length);
    return this.props.expenses.reduce((acc, expense) => {
      if(this.isThisMonth(expense.created_at)){
        return acc + expense.amount;
      }
    }, 0)
  }

  isToday(timestamp){
    /*TODO*/
    return true;
  }

  isThisMonth(timestamp){
    console.log(timestamp);
    /*TODO*/
    return true;
  }

  leftToSpendToday(){
    return this.dailyBudget() - this.state.moneySpentToday;
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
}



export default Dashboard;
