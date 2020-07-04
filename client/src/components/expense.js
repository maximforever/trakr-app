import React, { Component } from 'react';
import '../assets/stylesheets/expense.scss';


class Expense extends Component {
  constructor(props){
    super(props);

    this.state = {
      mouseDown: false,
      touchtime: 1000,
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
        <button onClick={(e) => {this.props.editExpense(e, expense.id)}}className="cancel lnr lnr-pencil"></button>
        <button onClick={(e) => {this.props.deleteExpense(e, expense.id)}}className="cancel lnr lnr-cross-circle"></button>
      </div>
    )
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
