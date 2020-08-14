import React, { Component } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import '../../assets/stylesheets/stripe/pricingPage.scss';


export default class pricingPage extends Component {
  constructor(props){
    super(props);

    this.state = {
      annualPlan: {},
      monthlyPlan: {},
      selected: null,
    }
  }

  componentDidMount(){
    this.fetchPriceOptions();
  }

  render(){
    if (!Object.keys(this.state.monthlyPlan).length || !Object.keys(this.state.annualPlan).length){
      return null;
    }

    return (
      <div>
        <h2>Pricing options:</h2>
        <div className="subscription-options">
          { this.renderOnePrice(this.state.monthlyPlan) }
          { this.renderOnePrice(this.state.annualPlan) }
        </div>
      </div>
    )
  }

  renderOnePrice(price){
    return(
      <div className={this.getOptionClass(price.id)} key={price.id} onClick={() => this.togglePlan(price.id)}>
        <div className="period">{ price.type }</div>
        <div className="price">
          $<span>{ price.price }</span>
        </div>
        <div className="description">{ price.description }</div>
      </div>
    )
  }

  fetchPriceOptions(){
    fetch('/billing/pricing-options')
      .then(res => res.json())
      .then((response) => { 
        this.setState({ 
          annualPlan: response.annual,
          monthlyPlan: response.monthly, 
        })
      })
      .catch((error) => { console.log("Error fetching session data", error); })
  }

  getOptionClass(id){
    return `option${this.state.selected === id ? ' selected' : ''}`
  }

  togglePlan(id){
    const newSelected = this.state.selected == id ? null : id;

    this.setState({
      selected: newSelected,    
    });
  }
}