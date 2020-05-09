import React, { Component } from 'react';
import './assets/stylesheets/App.scss';

import Welcome from './components/welcome'
import ExpenseForm from './components/expenseForm'
import ExpenseList from './components/expenseList'
import Dashboard from './components/dashboard'
import Navigation from './components/navigation'
import Settings from './components/settings'
import Stats from './components/stats'
import UserHeader from './components/userHeader'

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      status: "loading",
      user: null,
      expenses: [],
      categories: [],
      monthlyBudget: 0,
      currentMonthlyBudget: 0,
      currentPage: "home",
    }

    this.fetchExpenses = this.fetchExpenses.bind(this);
    this.fetchMonthlyBudget = this.fetchMonthlyBudget.bind(this);
    this.submitNewExpense = this.submitNewExpense.bind(this);
    this.deleteExpense = this.deleteExpense.bind(this);
    this.navigateToPage = this.navigateToPage.bind(this);
    this.updateMonthlyBudget = this.updateMonthlyBudget.bind(this);
  }

  componentDidMount(){
    this.fetchSession();
  }

  render() {
    return(
      <div className="App">
        {this.renderContent()}
      </div>
    )
  }

  renderContent() {
    switch (this.state.status){
      case "loggedIn":
        return this.renderLoggedInInterface();
        break;
      case "loggedOut":
        return this.renderLogin();
        break;
      default:
        break;
    }
  }

  renderLoggedInInterface() {
    return(
      <div className="App">
        <UserHeader user={this.state.user} />          
        <Navigation navigateToPage={this.navigateToPage} />
        {this.renderLoggedInBodyContent()}
      </div>
    )
  }

  renderLogin() {
    return (
      <div className="App">
        <Welcome />
      </div>
    )
  }

  renderLoggedInBodyContent() {
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
          monthlyBudget={this.getCurrentBudget()}
        />
        <ExpenseForm 
          submitNewExpense={this.submitNewExpense}
          categories={this.state.categories}
        />
        <ExpenseList 
          expenses={this.state.expenses} 
          deleteExpense={this.deleteExpense}
        />
      </div>
    );
  }

  renderStats(){
    return <Stats 
      expenses={this.state.expenses}
      categories={this.state.categories}
      monthlyBudget={this.getCurrentBudget()}
    />
  }

  renderSettings(){
    return (
      <Settings 
        monthlyBudget={this.state.monthlyBudget}
        currentMonthlyBudget={this.state.currentMonthlyBudget}
        updateMonthlyBudget={this.updateMonthlyBudget}
        key={this.state.monthlyBudget + this.state.currentMonthlyBudget}
      />
    )
  }

  getCurrentBudget(){
    if(this.state.currentMonthlyBudget === this.state.monthlyBudget){
      return this.state.monthlyBudget;
    }
    
    return this.state.currentMonthlyBudget;
  }
  
  submitNewExpense(expense){
    console.log(expense);
    fetch('/api/v1/expenses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(expense),
    })
      .then(res => res.json())
      .then((response) => { 
        if(response.status === 200){
          this.setState({
            expenses: response.expenses,
            categories: response.categories,
          })
        } else {
          console.log(response.message);
        }
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
          categories: response.categories,
        })
      })
      .catch((error) => { console.log("Error fetching data", error); })
  }

  fetchSession() {
    fetch('/session', this.fetchOptions())
      .then(res => res.json())
      .then((response) => { 
        this.setState({
          status: response.loggedIn,
          user: response.loggedInUser
        }, () => {
          if(this.state.status === "loggedIn"){
            // TODO this is uglyyyy
            this.fetchExpenses();
            this.fetchMonthlyBudget();
          }
        })
      })
      .catch((error) => { console.log("Error fetching session data", error); })
  }

  fetchExpenses() {
    fetch('/api/v1/expenses')
      .then(res => res.json())
      .then((response) => { 
        this.setState({
          expenses: response.expenses,
          categories: response.categories,
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
          currentMonthlyBudget: response.currentMonthlyBudget,
        })
      })
      .catch((error) => { console.log("Error fetching data", error); })
  }

  updateMonthlyBudget(newBudget) {
    fetch('/api/v1/users/monthly-budget', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newBudget),
    })
      .then(res => res.json())
      .then((response) => { 
        this.setState({
          monthlyBudget: response.monthlyBudget,
          currentMonthlyBudget: response.currentMonthlyBudget,
          currentPage: "home"
        })
      })
      .catch((error) => { console.log("Error fetching data", error); })
  }

  navigateToPage(page){
    this.setState({
      currentPage: page
    })
  }

  fetchOptions(){
    //const token = document.querySelector("meta[name='csrf-token']").getAttribute("content");
    return {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': 'someTestValue',
      }
    }
  }
}



export default App;
