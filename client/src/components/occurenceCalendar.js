import '../assets/stylesheets/occurenceCalendar.scss';

import React, { Component } from 'react';

class OccurenceCalendar extends Component {

  constructor(props){
    super(props);
  }

  render(){
    return (
      <div className="occurence-calendar">
        <h3>{this.renderCategoryTitle()}</h3>
        <div className="cell-wrapper">
          {this.renderCells()}
        </div>
      </div>
    ) 
  }

  renderCells() {
    const d = new Date();
    const days = this.daysInMonth(d.getMonth(), d.getYear());
    let cells = [];

    for(let i=1; i<=days; i++){
      const matchingExpenses = this.props.expenses.filter((expense) => {
        const selectedCategory = this.props.category.length ? this.props.category === expense.category : true;
        return i === this.getDay(expense.timestamp) && selectedCategory;
      })

      const thisClass = matchingExpenses.length ? "cell has-spending  " : "cell";

      cells.push(<div className={thisClass}>{i}</div>);
    }

    return cells;
  }

  renderCategoryTitle(){
    return this.props.category.length ? this.props.category : "any"; 
  }

  daysInMonth(month, year) {
    return new Date(year, month + 1, 0).getDate();
  }

  getDay(date){
    const d = new Date(date);
    return d.getDate();
  }

}

export default OccurenceCalendar;
