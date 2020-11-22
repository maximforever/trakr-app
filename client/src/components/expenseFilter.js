import '../assets/stylesheets/expenseFilter.scss';
import React, { Component } from 'react';

export default class FilteredExpenseList extends Component {

  constructor(props){
    super(props)

    this.state = {
      filteredCategory: "",
      displayFilter: false
    }

    this.toggleDisplayFilter = this.toggleDisplayFilter.bind(this);
  }

  render(){
    return (
      <div className="card opaque filter">
        {this.renderFilterContent()}
      </div>
    )
  }

  renderFilterContent(){
    return this.state.displayFilter ? this.renderOpenFilter() : this.renderClosedFilter();
  }

  renderOpenFilter() {
    return (
      <form>
        <div className="toggle-wrapper" onClick={this.toggleDisplayFilter}>
          <span className="lnr lnr-cross"></span> close filter
        </div>

        <div>
          <label>Category</label>
          { this.renderCategories() }
        </div>
        <div>
          <label>Description</label>
          <input 
            type="text" 
            placeholder="Expense name" 
            onChange={(e) => {
              this.props.updateDescription(e.target.value.trim())
            }}>
          </input>
          <br />
        </div>
        <div className="matching-expenses-found">{this.props.expenseCount} matching expenses found</div>
      </form>
    )
  }

  renderClosedFilter(){
    return (
      <div className="toggle-wrapper" onClick={this.toggleDisplayFilter}>
        <span className="lnr lnr-list"></span> filter expenses
      </div>
    )
  }

  renderCategories(){
    return(
      <div className="category-section">
        { this.props.categories.map((category) => this.renderCategory(category)) }
      </div>
    )
  }

  renderCategory(category){
    return (
      <span 
        key={category} 
        className={this.getCategoryName(category, this.state.filteredCategory)} 
        onClick={() => this.updateCategory(category)}>{category}
      </span>
    )
  }

  getCategoryName(category){
    return category === this.state.filteredCategory ? "category selected" : "category";
  }

  updateCategory(category){
    const newCategory = this.state.filteredCategory === category ? "" : category;

    this.setState({filteredCategory: newCategory});
    this.props.updateCategory(newCategory);
  }

  toggleDisplayFilter(){
    if(this.state.displayFilter){ this.clearFilters() }
    document.getElementById("expense-section-heading").scrollIntoView();

    this.setState((prevState) => ({displayFilter: !prevState.displayFilter}))
  }

  clearFilters(){
    this.props.updateDescription("");
    this.props.updateCategory("");
  }
}
