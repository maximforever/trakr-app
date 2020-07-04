import React, { Component } from 'react';
import '../assets/stylesheets/expense.scss';


class Expense extends Component {
  constructor(props){
    super(props);

    this.state = {
      mouseDown: false,
      touchtime: 1500,
      showOptions: false,
    }
  
    //this.listenForLongPress = this.listenForLongPress.bind(this);
  }

  render(){
    const { expense } = this.props;

    return(
      <div 
        className={this.getClass(expense.new)} 
        key={expense.id} 
        onMouseDown={(e) => this.handleMouseDown(e, expense.id)}
        onMouseUp={() => this.handleMouseUp()}
        onTouchStart={(e) => this.handleMouseDown(e, expense.id)}
        onTouchEnd={() => this.handleMouseUp()}
      >
        <div className="spending-info-wrapper">
          <div className="amount-section">
            <span className="amount">${expense.amount}</span> 
          </div>
          <div className="spending-info">
            <div className="category">{expense.category}</div>
            <div>{expense.description || "Undefined"}</div>
          </div>
        </div>

        {this.renderOptions(expense)}
      </div>
    )
  }

  renderOptions(expense){
    if(this.state.showOptions){
      return (
        <div className="options-button-wrapper">
          <button onClick={(e) => {this.props.editExpense(e, expense.id)}} className="cancel lnr lnr-pencil"></button>
          <button onClick={(e) => {this.props.deleteExpense(e, expense.id)}} className="cancel lnr lnr-trash"></button>
          <button onClick={() => this.toggleMenu() } className="cancel lnr lnr-cross-circle"></button>        
        </div>
      )
    } else {
      return (
        <button onClick={() => this.toggleMenu() }className="cancel lnr lnr-menu-circle"></button>
      )
    }
  }

  getClass(newExpense){
    return (newExpense !== "undefined" && newExpense) ? "one-expense new" : "one-expense";
  }

  handleMouseDown(e, id){
    if(this.state.mouseDown){ return }

    this.setState({
      mouseDown: true,
    }, this.listenForLongPress(e, id))
  }

  toggleMenu(){
    this.setState((prevState) => {
      return {
        showOptions: !prevState.showOptions,
      }
    })
  }

  handleMouseUp(){
    this.setState({
      mouseDown: false,
    });
  }

  listenForLongPress(e, id){
    setTimeout(() => {
      if(this.state.mouseDown){
        window.navigator.vibrate(100);
        this.props.editExpense(e, id);
      }
    }, this.state.touchtime)
  }
}

export default Expense;
