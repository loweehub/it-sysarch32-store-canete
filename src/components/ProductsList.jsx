// ProductsList.jsx
import React, { useEffect, useState } from "react";
import { db } from "../config/firebase-config";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  arrayUnion,
  doc,
  getDoc,
} from "firebase/firestore";
import "bootstrap/dist/css/bootstrap.min.css";
import HeroSection from "./HeroSection";
import ".././App.css"


function ProductsList({ setCartItems }) {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const productsSnapshot = await getDocs(collection(db, "products"));
      const productsData = productsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsData);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      const cartCollectionRef = collection(db, "cart");
      const cartDocRef = doc(cartCollectionRef, "ySrQRpUzgtTfKmSFwqFD");

      const cartDocSnap = await getDoc(cartDocRef);
      if (!cartDocSnap.exists()) {
        await addDoc(cartCollectionRef, { items: [productId] });
      } else {
        await updateDoc(cartDocRef, { items: arrayUnion(productId) });
      }

      console.log("Product added to cart successfully!");
      setCartItems((prevCount) => prevCount + 1);
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };

  return (
    <div className="container">
      <HeroSection />
      <div className="product-grid">
        <div className="product-list">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <img
                  src={product.image}
                  alt={product.title}
                  style={{ borderRadius: "10px" }}
                />
              </div>
              <div className="product-details">
                <h3>{product.title}</h3>
                <p>{product.description}</p>
                <p>{product.price}</p>
                <div className="product-buttons">
                  <button
                    className="maxBtn"
                    onClick={() => setSelectedProduct(product)}
                  >
                    Maximize
                  </button>
                  <button
                    className="addBtn"
                    onClick={() => handleAddToCart(product.id)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {selectedProduct && (
        <div className="modal" onClick={() => setSelectedProduct(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span
              className="close"
              onClick={() => setSelectedProduct(null)}
            >
              &times;
            </span>
            <img
              src={selectedProduct.image}
              alt={selectedProduct.title}
              style={{ width: "30%", borderRadius: "10px" }}
            />
            <h2>{selectedProduct.title}</h2>
            <p>{selectedProduct.description}</p>
            <p>{selectedProduct.price}</p>
            <button
              className="addBtn"
              onClick={() => handleAddToCart(selectedProduct.id)}
            >
              Add to Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductsList;
