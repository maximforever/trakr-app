import React, { Component } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import '../../assets/stylesheets/stripe/pricingOptions.scss';


export default class pricingPage extends Component {
  constructor(props){
    super(props);

    this.state = {
      annual: {},
      monthly: {},
    }
  }

  componentDidMount(){
    this.fetchPriceOptions();
  }

  render(){
    if (!Object.keys(this.state.monthly).length || !Object.keys(this.state.annual).length){
      return null;
    }

    return (
      <div>
        <h2>Pricing options:</h2>
        <div className="subscription-options">
          { this.renderOnePrice(this.state.monthly.unit_amount/100, this.state.monthly.metadata.description, this.state.monthly.nickname) }
          { this.renderOnePrice(this.state.annual.unit_amount/100, this.state.annual.metadata.description, this.state.annual.nickname) }
        </div>
      </div>
    )
  }

  renderOnePrice(price, description, period){
    return(
      <div className="option" key={price}>
        <div className="period">{ period }</div>
        <div className="price">
          $<span>{ price }</span>
        </div>
        <div className="description">{ description }</div>
      </div>
    )
  }

  fetchPriceOptions(){
    fetch('/billing/pricing-options')
      .then(res => res.json())
      .then((response) => { 
        this.setState({ 
          annual: response.annual[0],
          monthly: response.monthly[0], 
        })
      })
      .catch((error) => { console.log("Error fetching session data", error); })
  }
}