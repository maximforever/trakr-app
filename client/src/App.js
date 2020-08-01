import React, { Component } from 'react';
import './assets/stylesheets/App.scss';
import SignInPage from './components/signInPage'
import ExpenseForm from './components/expenseForm'
import ExpenseList from './components/expenseList'
import Dashboard from './components/dashboard'
import Navigation from './components/navigation'
import Settings from './components/settings'
import Stats from './components/stats'
import UserHeader from './components/userHeader'

const GREETINGS = ["Hi", "Hello", "Hola", "Sup", "Heya", "Ciao", "Howdy", "Aloha"];

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      status: "loading",
      user: null,
      expenses: {},
      expenseToUpdate: {},
      categories: [],
      monthlyBudget: 0,
      greeting: "Hi",
      currentDate: {
        month: null,
        year: null,
      },
      showExpenseForm: false,
      currentMonthlyBudget: 0,
      currentPage: "home",
      datepickerPages: ["home", "stats"],
    }

    this.fetchExpenses = this.fetchExpenses.bind(this);
    this.fetchUserSettings = this.fetchUserSettings.bind(this);
    this.submitNewExpense = this.submitNewExpense.bind(this);
    this.submitExpenseEdit = this.submitExpenseEdit.bind(this);
    this.deleteExpense = this.deleteExpense.bind(this);
    this.navigateToPage = this.navigateToPage.bind(this);
    this.updateSettings = this.updateSettings.bind(this);
    this.toggleExpenseForm = this.toggleExpenseForm.bind(this);
    this.previousMonth = this.previousMonth.bind(this);
    this.nextMonth = this.nextMonth.bind(this);
    this.editExpense = this.editExpense.bind(this);
    this.clearExpenseToUpdate = this.clearExpenseToUpdate.bind(this);
  }

  componentDidMount(){
    this.setCurrentDate();
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
        return <SignInPage />
      default:
        return null;
    }
  }

  renderLoggedInInterface() {
    return(
      <div>
        <UserHeader 
          user={this.state.user} 
          greeting={this.state.greeting}
        />          
        {this.renderNavigation()}
        {this.renderLoggedInBodyContent()}
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
        {this.renderDashboard()}
        <ExpenseForm 
          key={this.state.expenseToUpdate.updated_at  || 0 }
          submitNewExpense={this.submitNewExpense}
          submitExpenseEdit={this.submitExpenseEdit}
          toggleExpenseForm={this.toggleExpenseForm}
          categories={this.state.categories}
          expenseToUpdate={this.state.expenseToUpdate}
          clearExpenseToUpdate={this.clearExpenseToUpdate}
        />
        {this.renderExpenseList()}
      </div>
    );
  }

  renderNavigation(){
    if(this.state.showExpenseForm){ return null; }

    return(
      <Navigation 
        navigateToPage={this.navigateToPage} 
        renderDateSelector={this.pageShouldIncludeDatepicker()}
        date={this.state.currentDate}
        nextMonth={this.nextMonth}
        previousMonth={this.previousMonth}
      />
    )
  }

  renderDashboard(){
    if(this.state.showExpenseForm){ return null; }

    return(
      <Dashboard
        expenses={this.currentMonthExpenses()}
        monthlyBudget={this.getCurrentBudget()}
        currentDate={this.state.currentDate}
      />
    )
  }

  renderExpenseList(){
    return(
      <ExpenseList 
        expenses={this.currentMonthExpenses()} 
        deleteExpense={this.deleteExpense}
        editExpense={this.editExpense}
      />
    )
  }

  renderStats(){
    return <Stats 
      expenses={this.currentMonthExpenses()}
      categories={this.state.categories}
      monthlyBudget={this.getCurrentBudget()}
      currentDate={this.state.currentDate}
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
  
  submitNewExpense(expense, successCallback){
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
          let updatedExpenses = this.insertOneExpense(response.newExpense);

          if(!updatedCategories.includes(expense.category)){
            updatedCategories = updatedCategories.concat(expense.category)
          }

          this.setState({
            expenses: updatedExpenses,
            categories: updatedCategories,
          }, () => {
            this.toggleExpenseForm();
            successCallback(true);
          });
        } else {
          console.log(response.message);
        }
      })
      .catch((error) => { console.log("Error submitting expense", error); })
  }

  submitExpenseEdit(expense, successCallback){
    fetch('/api/v1/expenses', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(expense),
    })
      .then(res => res.json())
      .then((response) => { 
        if(response.status === 200){
          let updatedCategories = this.state.categories;
          let updatedExpenses = this.updateOneExpense(response.updatedExpense);

          if(!updatedCategories.includes(expense.category)){
            updatedCategories = updatedCategories.concat(expense.category)
          }

          this.setState({
            expenses: updatedExpenses,
            categories: updatedCategories,
          }, () => {
            this.toggleExpenseForm();
            successCallback(true);
          });
        } else {
          console.log(response.message);
        }
      })
      .catch((error) => { console.log("Error updating expense", error); })
  }



  deleteExpense(e, id){
    e.stopPropagation();
    fetch(`/api/v1/expenses/${id}${this.yearParams()}`, {
      method: 'DELETE',
    })
      .then(res => res.json())
      .then((response) => { 
        this.setState({
          expenses: this.generateUpdatedExpenseList(response.expenses),
          categories: response.categories,
        })
      })
      .catch((error) => { console.log("Error fetching data", error); })
  } 

  clearExpenseToUpdate(){
    this.setState({
      expenseToUpdate: {}
    })
  }

  editExpense(e, id){
    e.stopPropagation();
    let expenseToUpdate = this.findExpenseById(id);

    this.setState({ expenseToUpdate, showExpenseForm: true })
  } 

  findExpenseById(id){
    let expenses = this.currentMonthExpenses();

    return expenses.filter((expense) => {
      return expense.id === id;
    })[0];
  }

  fetchSession() {
    // TODO: session should return expenses & user data if the user is logged in
    // this doesn't need to be a separate request

    fetch('/session', this.fetchOptions())
      .then(res => res.json())
      .then((response) => { 
        this.setState({
          status: response.status,
          user: response.loggedInUser
        }, () => {
          if(this.state.status === "loggedIn"){
            // TODO this is uglyyyy
            this.setLastVisitedPage();
            this.fetchExpenses();
            this.fetchUserSettings();
            this.setGreeting();
          }
        })
      })
      .catch((error) => { console.log("Error fetching session data", error); })
  }

  fetchExpenses() {
    fetch(`/api/v1/expenses/${this.yearParams()}`)
      .then(res => res.json())
      .then((response) => { 
        this.setState({
          expenses: this.generateUpdatedExpenseList(response.expenses),
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

  setGreeting(){ 
    this.setState({
      greeting: GREETINGS[Math.floor(Math.random() * GREETINGS.length)]
    })
  }

  setLastVisitedPage(){
    const lastVisitedPage = window.localStorage.getItem('trakr-page');

    if(lastVisitedPage !== null){
      this.setState({
        currentPage: lastVisitedPage,
      })
    }
  }

  setCurrentDate(){
    const d = new Date();

    let currentDate = {
      month: d.getMonth() + 1,
      year: 1900 + d.getYear(),
    }

    this.setState({
      currentDate
    })
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
    window.localStorage.setItem("trakr-page", page)

    this.setState({
      currentPage: page
    })
  }

  pageShouldIncludeDatepicker(){
    return this.state.datepickerPages.includes(this.state.currentPage);
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

  toggleExpenseForm(){
    this.setState((prevState) => {
      return {
        showExpenseForm: !prevState.showExpenseForm,
      }
    })
  }

  yearParams(){
    return `?year=${this.state.currentDate.year}`;
  }

  nextMonth(){
    // JS months run 0 to 11;
    let newMonth = this.state.currentDate.month < 12 ? this.state.currentDate.month + 1 : 1;
    let newYear = newMonth === 1 ? this.state.currentDate.year + 1 : this.state.currentDate.year;
    this.updateCurrentDate(newMonth, newYear);
  }

  previousMonth(){
    // JS months run 0 to 11
    let newMonth = this.state.currentDate.month > 1 ? this.state.currentDate.month - 1 : 12;
    let newYear = newMonth === 12 ? this.state.currentDate.year - 1 : this.state.currentDate.year;
    this.updateCurrentDate(newMonth, newYear);
  }

  updateCurrentDate(newMonth, newYear){
    const currentDate = {
      month: newMonth,
      year: newYear,
    }

    this.setState({currentDate}, () => {
      if(!this.thisYearsExpensesAreAvailable()){ this.fetchExpenses() }
    });
  }

  thisYearsExpensesAreAvailable() {
    const thisYear = this.state.currentDate.year;
    return typeof(this.state.expenses[thisYear]) !== 'undefined'
  }

  generateUpdatedExpenseList(incomingExpenses){
    const year = this.formattedYear(this.state.currentDate.year);
    let currentExpenses = {...this.state.expenses};
    currentExpenses[year] = {};

    incomingExpenses.forEach((expense) => {
      const month = (new Date(expense.timestamp).getMonth() + 1);
      // add trailing 0
      const formattedMonth = this.formattedMonth(month);

      if(typeof(currentExpenses[year][formattedMonth]) === 'undefined'){
        currentExpenses[year][formattedMonth] = [expense];
      } else {
        currentExpenses[year][formattedMonth].push(expense);
      }
    });

    return currentExpenses
  }

  insertOneExpense(expense){
    let currentExpenses = {...this.state.expenses};
    const month = this.formattedMonth(new Date(expense.timestamp).getMonth() + 1);
    const year = this.formattedYear(new Date(expense.timestamp).getYear() + 1900);
    
    if (currentExpenses[year][month] === undefined) {
      currentExpenses[year][month] = [];
    }

    currentExpenses[year][month].push({...expense, new: true});
    return currentExpenses;
  }

  updateOneExpense(updatedExpense){
    let currentExpenses = {...this.state.expenses};
    const month = this.formattedMonth(new Date(updatedExpense.timestamp).getMonth() + 1);
    const year = this.formattedYear(new Date(updatedExpense.timestamp).getYear() + 1900);

    currentExpenses[year][month] = currentExpenses[year][month].map((expense) => {
      if(expense.id === updatedExpense.id){
        return {...updatedExpense, new: true};
      } else {
        return expense;
      }
    })  

    return currentExpenses;
  }

  currentMonthExpenses(){
    if(typeof(this.state.expenses[this.formattedYear(this.state.currentDate.year)]) === 'undefined'){ 
      return []; 
    }

    const thisYearsExpenses = this.state.expenses[this.formattedYear(this.state.currentDate.year)];
    const thisMonthsExpenses = thisYearsExpenses[this.formattedMonth(this.state.currentDate.month)];  

    return  thisMonthsExpenses || [];
  }

  formattedMonth(month){
    return (month.toString().length === 1) ? `0${month}` : month.toString();
  }

  formattedYear(year){
    return year.toString();
  }
}

export default App;