import React, { Component } from 'react';
import ExpenseForm from './components/ExpenseForm'
import Expenses from './components/Expenses'
import Dashboard from './components/Dashboard'
import Navigation from './components/Navigation'
import './assets/stylesheets/App.scss';

class App extends Component {

  constructor(props){
    super(props);

    this.state = {
      expenses: [],
      monthlyBudget: 0,
      currentPage: "home"
    }

    this.fetchExpenses = this.fetchExpenses.bind(this);
    this.fetchMonthlyBudget = this.fetchMonthlyBudget.bind(this);
    this.submitNewExpense = this.submitNewExpense.bind(this);
    this.deleteExpense = this.deleteExpense.bind(this);
    this.navigateToPage = this.navigateToPage.bind(this);
  }

  componentDidMount(){
    this.fetchExpenses();
    this.fetchMonthlyBudget();
  }

  render() {
    return(
      <div className="App">
        <Navigation navigateToPage={this.navigateToPage} />
        {this.renderBodyContent()}
      </div>
    )
  }

  renderBodyContent() {
    if(this.state.currentPage === "home"){
      return this.renderHome();
    } else if (this.state.currentPage === "stats"){
      return this.renderStats();
    } else if (this.state.currentPage === "settings"){
      return this.renderSettings();
    }
  }

  renderHome(){
    return (
      <div className="home">
        
        <Dashboard
          expenses={this.state.expenses}
          monthlyBudget={this.state.monthlyBudget}
        />
        <ExpenseForm 
          submitNewExpense={this.submitNewExpense}
        />
        <Expenses 
          expenses={this.state.expenses} 
          deleteExpense={this.deleteExpense}
        />
      </div>
    );
  }

  renderStats(){
    return <div>Look, charts!</div>
  }

  renderSettings(){
    return <div>Get your settings in order.</div>
  }
  
  submitNewExpense(expense){
    fetch('/api/v1/expenses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(expense),
    })
      .then(res => res.json())
      .then((response) => { 
        this.setState({
          expenses: response.expenses,
        })
      })
      .catch((error) => { console.log("Error fetching data", error); })
  }

  deleteExpense(id){
    fetch(`/api/v1/expenses/${id}`, {
      method: 'DELETE',
    })
      .then(res => res.json())
      .then((response) => { 
        this.setState({
          expenses: response.expenses,
        })
      })
      .catch((error) => { console.log("Error fetching data", error); })
  }

  fetchExpenses() {
    fetch('/api/v1/expenses')
      .then(res => res.json())
      .then((response) => { 
        this.setState({
          expenses: response.expenses,
        })
      })
      .catch((error) => { console.log("Error fetching data", error); })
  }

  fetchMonthlyBudget() {
    fetch('/api/v1/users/monthly-budget')
      .then(res => res.json())
      .then((response) => { 
        this.setState({
          monthlyBudget: response.monthlyBudget,
        })
      })
      .catch((error) => { console.log("Error fetching data", error); })
  }

  navigateToPage(page){
    console.log(page);
    this.setState({
      currentPage: page
    })
  }
}



export default App;
