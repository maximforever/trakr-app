import React, { Component } from 'react';
import StripeCheckoutForm from './stripeCheckoutForm'
import '../../assets/stylesheets/stripe/pricingPage.scss';

import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';

const stripePromise = loadStripe("pk_test_51HBnPmGoqOAmrakRbd5XHPsukzH2zTF9slc8x8KS5uf4PizOhXxDVkyFa41MTqRGYRKT5AZkycnEKzQVfPUm3EZ400O2Mzlwvs");

export default class pricingPage extends Component {
  constructor(props){
    super(props);

    this.state = {
      annualPlan: {},
      monthlyPlan: {},
      selectedPrice: null,
    }
  }

  componentDidMount(){
    this.fetchPriceOptions();
  }

  render(){
    if (this.state.monthlyPlan  === undefined || !Object.keys(this.state.monthlyPlan).length || !Object.keys(this.state.annualPlan).length){
      return(
        <div className="card">
          <p>Looks like we're having trouble fetching some pricing details - sorry about that!</p>
        </div>
      ) 
    }

    return (
      <div className="pricing-wrapper">
        <h2>Pricing options:</h2>
        <div className="subscription-options">
          { this.renderOnePrice(this.state.monthlyPlan, "month") }
          { this.renderOnePrice(this.state.annualPlan, "year") }
        </div>
        {this.renderCheckoutForm()}
      </div>
    )
  }

  renderOnePrice(price, duration){
    return(
      <div className={this.getOptionClass(price.id)} key={price.id} onClick={() => this.handleClick(price.id)}>
        <div className="period">{ price.type }</div>
        <div className="price">
          <div>${ price.price }</div>
          <div className="subtext">per {duration}</div>
        </div>
        <div className="description">{ price.description }</div>
      </div>
    )
  }

  renderCheckoutForm(){
    return (
      <Elements stripe={stripePromise}>
        <StripeCheckoutForm 
          stripeId = {this.props.stripeId}
          priceId = {this.state.selectedPrice}
          
        />
      </Elements>
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
    return `option${this.state.selectedPrice === id ? ' selected' : ''}`
  }

  handleClick(id){
    const newSelectedPrice = this.state.selectedPrice === id ? null : id;

    this.setState({
      selectedPrice: newSelectedPrice,    
    });
  }
}