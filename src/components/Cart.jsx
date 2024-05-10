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

function Cart({ setCartItems }) {
  const [cartItems, setLocalCartItems] = useState([]);

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
              cartItemsData.push({ id: productId, ...productData });
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
      
      fetchCartItems();
    
      setCartItems((prevCount) => prevCount - 1);
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
  
  return (
    <div className="container">
      <div className="row">
        {}
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
        {}
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Order Summary</h5>
              <p>Total Items: {cartItems.length}</p>
              <p>Total Price: ${calculateTotalPrice()}</p>
              <button className="chkBtn">Proceed to Checkout</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;