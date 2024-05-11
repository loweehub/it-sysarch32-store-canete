import React, { useEffect, useState } from "react";
import { db } from "../config/firebase-config";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  arrayRemove,
} from "firebase/firestore"; 
import "bootstrap/dist/css/bootstrap.min.css";
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51PF8nsAAQ3Xy53v34jSywdsxZEtDEPQGejJajYwgzLH3hmd5RGEHbgufYWhGGefY1PGTxV7zxccQ3sWYDXanX3DW00sQZJTghr');

function Cart({ setCartItems }) {
  const [cartItems, setLocalCartItems] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCartItems();
  }, []);

  useEffect(() => {
    calculateTotalPrice();
  }, [cartItems]);

  const fetchCartItems = async () => {
    try {
      const cartSnapshot = await getDocs(collection(db, "cart"));
      const cartItemsData = [];

      for (const docRef of cartSnapshot.docs) {
        const itemIds = docRef.data().items; 
        const productPromises = itemIds.map(async (productId) => {
          try {
            const productDoc = await getDoc(doc(db, "products", productId));
            if (productDoc.exists()) {
              const productData = productDoc.data();
              const newItem = { id: productId, ...productData };
              const isDuplicate = cartItemsData.some(item => item.id === newItem.id);
              if (!isDuplicate) {
                cartItemsData.push(newItem);
              } else {
                console.log(`Item with ID ${newItem.id} already exists in the cart.`);
              }
            } else {
              console.error(`Product with ID ${productId} does not exist.`);
            }
          } catch (error) {
            console.error("Error fetching product:", error);
          }
        });

        await Promise.all(productPromises);
      }

      setLocalCartItems(cartItemsData);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const handleRemoveFromCart = async (productId) => {
    try {
      const cartCollectionRef = collection(db, "cart");
      const cartSnapshot = await getDocs(cartCollectionRef);
      const cartDocRef = cartSnapshot.docs[0].ref; 
      await updateDoc(cartDocRef, { items: arrayRemove(productId) });
      console.log("Product removed from cart successfully!");
      
      const updatedCartItems = cartItems.filter(item => item.id !== productId);
      setLocalCartItems(updatedCartItems);
      
      setCartItems(prevCount => prevCount - 1);
    } catch (error) {
      console.error("Error removing product from cart:", error);
    }
  };

  const calculateTotalPrice = () => {
    const totalPrice = cartItems.reduce((total, item) => {
      if (typeof item.price === 'string') {
        const priceWithoutDollarSign = parseFloat(item.price.replace("$", ""));
        total += priceWithoutDollarSign;
      } else {
        console.error(`Invalid price data for item with ID ${item.id}`);
      }
      return total;
    }, 0);
  
    return totalPrice.toFixed(2);
  };

  const handleClick = async () => {
    try {
      const stripe = await stripePromise;
      const response = await fetch('http://localhost:4001/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cartItems }), // Send cartItems to the backend
      });

      if (response.ok) {
        const session = await response.json();
        const result = await stripe.redirectToCheckout({ sessionId: session.id });

        if (result.error) {
          setError(result.error.message);
        }
      } else {
        setError('Error creating checkout session');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Products</h5>
              <ul className="list-group list-group-flush">
                {cartItems.map((item) => (
                  <li key={item.id} className="list-group-item">
                    <div className="row">
                      <div className="col-md-3">
                        <img
                          src={item.image}
                          alt={item.title}
                          style={{ width: "100%", borderRadius: "5px" }}
                        />
                      </div>
                      <div className="col-md-9">
                        <h6>{item.title}</h6>
                        <p>{item.description}</p>
                        <p>{item.price}</p>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleRemoveFromCart(item.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Order Summary</h5>
              <p>Total Items: {cartItems.length}</p>
              <p>Total Price: ${calculateTotalPrice()}</p>
              {error && <p className="text-danger">{error}</p>}
              <button className="btn btn-primary" onClick={handleClick}>Checkout</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
