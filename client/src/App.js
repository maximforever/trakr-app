import React, { Component } from 'react';
import ExpenseForm from './components/ExpenseForm'
import Expenses from './components/Expenses'
import './assets/stylesheets/App.scss';

class App extends Component {

  constructor(props){
    super(props);

    this.state = {
      expenses: []
    }

    this.fetchExpenses = this.fetchExpenses.bind(this);
    this.submitNewExpense = this.submitNewExpense.bind(this);
    this.deleteExpense = this.deleteExpense.bind(this);
  }

  componentDidMount(){
    this.fetchExpenses();
  }

  render() {
    return (
      <div className="App">
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
        console.log(response);
        this.setState({
          expenses: response.expenses,
        })
      })
      .catch((error) => { console.log("Error while fetching test datas", error); })
  }

  deleteExpense(id){
    fetch(`/api/v1/expenses/${id}`, {
      method: 'DELETE',
    })
      .then(res => res.json())
      .then((response) => { 
        console.log(response);
        this.setState({
          expenses: response.expenses,
        })
      })
      .catch((error) => { console.log("Error while fetching test datas", error); })
  }

  fetchExpenses() {
    fetch('/api/v1/expenses')
      .then(res => res.json())
      .then((response) => { 
        this.setState({
          expenses: response.expenses,
        })
      })
      .catch((error) => { console.log("Error while fetching test datas", error); })
  }
}



export default App;
