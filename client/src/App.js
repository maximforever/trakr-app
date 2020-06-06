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
    this.fetchUserSettings = this.fetchUserSettings.bind(this);
    this.submitNewExpense = this.submitNewExpense.bind(this);
    this.deleteExpense = this.deleteExpense.bind(this);
    this.navigateToPage = this.navigateToPage.bind(this);
    this.updateSettings = this.updateSettings.bind(this);
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
      case "loggedOut":
        return this.renderLogin();
      default:
        return null;
    }
  }

  renderLoggedInInterface() {
    return(
      <div>
        <UserHeader user={this.state.user} />          
        <Navigation navigateToPage={this.navigateToPage} />
        {this.renderLoggedInBodyContent()}
      </div>
    )
  }

  renderLogin() {
    return (
      <div>
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
          editExpense={this.editExpense}
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
        preferredFirstName={this.state.user.firstName}
        updateSettings={this.updateSettings}
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
          let updatedCategories = this.state.categories;
          let updatedExpenses = this.state.expenses.concat({...response.newExpense, new: true})

          if(!updatedCategories.includes(expense.category)){
            updatedCategories = updatedCategories.concat(expense.category)
          }

          this.setState({
            expenses: updatedExpenses,
            categories: updatedCategories,
          })

        } else {
          console.log(response.message);
        }
      })
      .catch((error) => { console.log("Error fetching data", error); })
  }

  deleteExpense(e, id){
    e.stopPropagation();
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

  editExpense(id){
    console.log(id);
    
  } 

  fetchSession() {
    fetch('/session', this.fetchOptions())
      .then(res => res.json())
      .then((response) => { 
        this.setState({
          status: response.status,
          user: response.loggedInUser
        }, () => {
          if(this.state.status === "loggedIn"){
            // TODO this is uglyyyy
            this.fetchExpenses();
            this.fetchUserSettings();
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

  fetchUserSettings() {
    fetch('/api/v1/users/settings')
      .then(res => res.json())
      .then((response) => { 
        let user = {...this.state.user}
        user.firstName = response.preferredFirstName

        this.setState({
          monthlyBudget: response.monthlyBudget,
          currentMonthlyBudget: response.currentMonthlyBudget,
          user,
        })
      })
      .catch((error) => { console.log("Error fetching data", error); })
  }

  updateSettings(newSettings) {
    fetch('/api/v1/users/settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newSettings),
    })
      .then(res => res.json())
      .then((response) => {
        let user = {...this.state.user}
        user.firstName = response.preferredFirstName

        this.setState({
          monthlyBudget: response.monthlyBudget,
          currentMonthlyBudget: response.currentMonthlyBudget,
          currentPage: "home",
          user,
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
