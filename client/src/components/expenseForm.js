import '../assets/stylesheets/expenseForm.scss';

import React, { Component } from 'react';

const defaultState = {
  amount: "",
  description: "",
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
    this.resetExpenseFormOnResponse = this.resetExpenseFormOnResponse.bind(this);
  }

  componentDidMount(){
    if(this.editingExpense()){
      this.setStateFromExistingExpense(this.props.expenseToUpdate)
    } else {
      this.resetState();
    } 
  }

  render(){
    return this.state.displayForm ? this.renderNewExpenseForm() : this.renderAddExpenseToggle();
  }

  renderAddExpenseToggle(){
    return (
      <button className="add-expense-toggle lg submit" onClick={this.toggleExpenseForm}>
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
                  autoFocus={true} 
                  placeholder="Amount"
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
            <input value={this.state.description} type='text' name='description' placeholder="What did you buy?" onChange={this.handleInputChange}></input>
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
            <button className="submit md" disabled={this.validExpense()}>{this.formLabel()}</button>
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
    const clickedCategory = e.target.innerHTML.trim().toLowerCase()
    const category = clickedCategory === this.state.category ? "" : clickedCategory;

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
      timestamp: this.state.timestamp,
      category: this.state.category,
    }

    if(this.editingExpense()){
      newExpense.id = this.state.id;
      this.props.submitExpenseEdit(newExpense, this.resetExpenseFormOnResponse);
    } else {
      this.props.submitNewExpense(newExpense, this.resetExpenseFormOnResponse);
    }
  }

  resetExpenseFormOnResponse(success){
    if(success){ 
      this.resetState(); 
    } else {
      console.log("something went wrong");
    }
  }

  resetState(){
    this.setState({...defaultState})
    this.setDateTimePickerToNow();
  }

  setStateFromExistingExpense(expense){
    const expenseDatetime = new Date(expense.timestamp).toISOString().slice(0,16);

    this.setState({ 
      ...expense, 
      displayForm: true,
      timestamp: expenseDatetime })
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
    }, () => {
      // if we closed the form, clear it
      if(!this.state.displayForm){
        this.props.clearExpenseToUpdate();
        this.resetState();
      }
    });
  }

  formLabel(){
    return this.editingExpense() ? "Save changes" : "Add expense";
  }

  editingExpense(){
    return Object.keys(this.props.expenseToUpdate).length
  }
}

export default ExpenseForm;
