import '../assets/stylesheets/expenseForm.scss';

import React, { Component } from 'react';

const defaultState = {
  amount: "",
  description: "",
  merchant: "",
  timestamp: "",
  category: "",
  displayForm: false,
  showCategoryInput: false,
}

class ExpenseForm extends Component {
  constructor(props){
    super(props);

    this.state = {}

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setDateTimePickerToNow = this.setDateTimePickerToNow.bind(this);
    this.toggleExpenseForm = this.toggleExpenseForm.bind(this);
    this.populateCategory = this.populateCategory.bind(this);
    this.setCategory = this.setCategory.bind(this);
    this.revealCategoryInput = this.revealCategoryInput.bind(this);
  }

  componentDidMount(){
    this.resetState();
  }

  render(){
    return this.state.displayForm ? this.renderNewExpenseForm() : this.renderAddExpenseToggle();
  }

  renderAddExpenseToggle(){
    return (
      <button className="lg submit" onClick={this.toggleExpenseForm}>
        <span className="lnr lnr-plus-circle"></span>Add new expense
      </button>
    )
  }

  renderNewExpenseForm(){
    return (
      <div className="new-expense-form card">
        <h2>New Expense</h2>
        <form onSubmit={this.handleSubmit}>
          <div className="one-input">
            <label>Amount</label>
            <div className="amount-spent-wrapper">
              $ <input 
                  autofocus="true" 
                  className="amount-spent"
                  min="1" 
                  value={this.state.amount} 
                  type='number' 
                  name='amount' 
                  onChange={this.handleInputChange}>
                </input>
            </div>
          </div>

          <div className="one-input">
            <label>Description</label>
            <input value={this.state.description} type='text' name='description' onChange={this.handleInputChange}></input>
          </div>

          <div className="one-input">
            <label>Merchant</label>
            <input value={this.state.merchant} type='text' name='merchant' onChange={this.handleInputChange}></input>
          </div>

          <div className="one-input">
            <label>Category</label>
            {this.renderCategorySection()}
            {this.renderCategoryInput()}
          </div>

          <div className="one-input">
            <label>Date</label>
            <input value={this.state.timestamp} type='datetime-local' name='timestamp' onChange={this.handleInputChange}></input>
          </div>

          <div className="button-wrapper">
            <button className="cancel" onClick={this.toggleExpenseForm}>Cancel</button>
            <button className="submit md" disabled={this.validExpense()}>Add Expense</button>
          </div>
        </form>
      </div>
    )
  }

  renderCategorySection(){
    return (
      <div className="category-section">
        {this.renderCategoryList()}
        {this.renderCategoryToggle()}
      </div>
    )
  }

  revealCategoryInput() {
    this.setState({
      showCategoryInput: true,
    })
  }

  renderCategoryInput(){
    if(!this.state.showCategoryInput){ return null; }
    return (<input value={this.state.category} type='text' name='category'  placeholder="enter category" onChange={this.handleInputChange}></input>)
  }

  renderCategoryList(){
    if(!this.props.categories.length){ return null; }

    return this.props.categories.map((category) => {
      if(category != null && category.trim().length){
        return <span 
          key={category} 
          className="category" 
          onClick={this.setCategory} 
          className={this.getCategoryClass(category)}>{category}</span>
        //return <span key={category} className="category" onClick={this.populateCategory}>{category}</span>
      }

      return null;
    })
  }

  renderCategoryToggle(){
    if(this.state.showCategoryInput){ return null; }

    return (
      <span className="category add-new-category" onClick={this.revealCategoryInput}>
        <span className="lnr lnr-plus-circle"></span>
      </span>
    )
  }

  handleInputChange(e){
    const name = e.target.name;
    this.setState({
      [name]: e.target.value,
    });
  }

  setCategory(e){
    const category = e.target.innerHTML.trim().toLowerCase();

    this.setState({
      category,
    })
  }

  populateCategory(e){
    this.setState({
      category: e.target.innerHTML.trim(),
      showCategoryInput: true,
    })
  }

  getCategoryClass(category){
    let className = "category"
    if(category === this.state.category){ className += " selected"}
    return className;
  }

  handleSubmit(e){
    e.preventDefault(e);
    
    const newExpense = {
      amount: this.state.amount,
      description: this.state.description,
      merchant: this.state.merchant,
      timestamp: this.state.timestamp,
      category: this.state.category,
    }

    this.props.submitNewExpense(newExpense, (success) => {
      if(success){
        this.resetState();
      }
    });
  }

  resetState(){
    this.setState({...defaultState})
    this.setDateTimePickerToNow();
  }

  setDateTimePickerToNow(){
    const timezoneOffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    const currentDatetime = new Date(Date.now() - timezoneOffset).toISOString().slice(0,16);
    this.setState({
      timestamp: currentDatetime
    })
  }

  validExpense(){
    return (this.state.amount === 0 || this.state.description.length < 2 || !this.state.timestamp.length );
  }

  toggleExpenseForm(){
    this.props.toggleExpenseForm();
    this.setState((prevState) => {
      return {
        displayForm: !prevState.displayForm
      }
    })
  }
}

export default ExpenseForm;
