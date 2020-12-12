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
    return (
      <div className="dashboard">
        {this.displayingCurrentMonth() ? this.renderThisMonthsDashboard() : this.renderAnotherMonthsDashboard()}
      </div>
    )
  }

  renderThisMonthsDashboard(){
    return(
      <div>
        <div className="card thin square full-square">
          <div className="label">Spent today</div>
          <div className="metric">
            <span className={this.getMetricClass(this.dailyBudget() - this.moneySpentToday())}>
              {this.moneyFormat(this.moneySpentToday())}
            </span>
            <span className="submetric">
              |{this.moneyFormat(this.dailyBudget())}
            </span>
          </div>
        </div>
        <div className="half-square-wrapper">
          <div className="card thin square half-square">
            <div className="label">Spent this month</div>
            <div className="metric">
              <span className={this.getMetricClass(this.props.monthlyBudget - this.moneySpentThisMonth())}>
                {this.moneyFormat(this.moneySpentThisMonth())}
              </span>
              <span className="submetric">
                |{this.moneyFormat(this.props.monthlyBudget)}
              </span>
            </div>
          </div>
          <div className="card thin square half-square">
            <div className="label">Monthly balance</div>
            <div className="metric">
              <span className={this.getMetricClass(this.monthlyBalance())}>
                {this.moneyFormat(this.monthlyBalance())}
              </span> 
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderAnotherMonthsDashboard(){
    return (
      <div>
        <div className="card thin square full-square">
          <div className="label">Spent this month</div>
          <div className="metric">
            <span>
              {this.moneyFormat(this.moneySpentThisMonth())}
            </span>
            <span className="submetric">
              |{this.moneyFormat(this.props.monthlyBudget)}
            </span>
          </div>
        </div>
      </div>
    )
  }

  moneySpentToday(){
    return this.props.expenses.reduce((acc, expense) => {
      return (this.isToday(expense.timestamp)) ? (acc + expense.amount) : acc;
    }, 0);
  }

  moneySpentThisMonth(){
    return this.props.expenses.reduce((acc, expense) => {
      return (this.expenseIsInThisMonth(new Date(), expense.timestamp)) ? acc + expense.amount : acc;
    }, 0)
  }

  isToday(timestamp){
    const today = new Date();
    timestamp = new Date(timestamp);
    
    // this corrects the timestamp timezone
    timestamp.setHours(timestamp.getHours() + timestamp.getTimezoneOffset()/60)

    return (
      today.getYear() === timestamp.getYear() && 
      today.getMonth() === timestamp.getMonth() && 
      today.getDate() === timestamp.getDate()
    )
  }

  expenseIsInThisMonth(today, timestamp){
    timestamp = new Date(timestamp);
    return (
      this.props.currentDate.year === timestamp.getYear() + 1900 && 
      this.props.currentDate.month === timestamp.getMonth() + 1
    )
  }

  displayingCurrentMonth(){
    const currentDate = new Date();
    return (
      this.props.currentDate.year === currentDate.getYear() + 1900 && 
      this.props.currentDate.month === currentDate.getMonth() + 1
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
