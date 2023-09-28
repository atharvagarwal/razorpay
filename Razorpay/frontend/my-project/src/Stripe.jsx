import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Checkout from "./Checkout"
import "./Payment.css";


// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe("pk_test_51KoYjUSDZBjXIg74p1ZhgwnGtf79wx8WPouiopwt0qF3TGeKkyGjUbB8zZFtDcNS2dyajztffYhAUkk8NXbz9SBV00uupHjsbU");

export default function Stripe() {
  const [clientSecret, setClientSecret] = useState("");
  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch("http://localhost:4000/api/stripeCheckout", {
      method: "POST",
      body: JSON.stringify({ amount:2000 }), 
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, []);

  const appearance = {
    theme: 'stripe',
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <>
    <div className="flex items-center justify-center mt-20 flex-col">
    <h1 className="text-3xl font-bold text-center p-6">Make Payment</h1>
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <Checkout/>
        </Elements>
      )}
      </div>
    </>
  );
}