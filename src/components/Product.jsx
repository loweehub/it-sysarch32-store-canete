import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { db, storage } from "../configs/firebase";
import {
  collection,
  doc,
  getDoc,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function Product({ user }) {
  const { productId } = useParams();

  const [productName, setProductName] = useState("");
  const [productList, setProductList] = useState([]);
  const [message, setMessage] = useState("");

  const productListCollection = collection(db, "product_list");

  useEffect(() => {
 
    getProductList();
    getProduct(productId);
  }, []);

  const getProductList = async () => {
    try {
    
      const unsubscribe = onSnapshot(
        query(productListCollection, orderBy("timestamp")),
        (snapshot) => {
        
          const updatedProductList = snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          setProductList(updatedProductList);
        }
      );
      return () => unsubscribe(); 
    } catch (error) {
      console.error(error);
    }
  };

  const getProduct = async (productId) => {
    try {
      const productDocRef = doc(db, "products", productId);
      const productDocSnap = await getDoc(productDocRef);
      if (productDocSnap.exists()) {
        const productData = { ...productDocSnap.data(), id: productDocSnap.id };
        setProductName(productData.name);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const send = async () => {
    try {
      if (message.trim() === "") {
        return;
      }

      await addDoc(productListCollection, {
        message,
        senderName: user.displayName ?? user.email,
        senderId: user.uid,
        productId,
        timestamp: serverTimestamp(),
      });

      setMessage("");
    } catch (error) {
      console.error(error);
    }
  };

  const fileUpload = async (file) => {
    if (!file) {
      return;
    }

    const storageRef = ref(
      storage,
      `products/${productId}/${Date.parse(new Date())}_${file.name}`
    );
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    await addDoc(productListCollection, {
      message,
      senderName: user.displayName ?? user.email,
      senderId: user.uid,
      productId,
      image: downloadURL,
      timestamp: serverTimestamp(),
    });
  };

  return (
    <>
      <Link to="/products">Back</Link>
      <h1>{productName}</h1>
      {productList.map((item, index) =>
        item.timestamp ? (
          <div style={{ marginBottom: 15 }} key={index}>
            <b>
              {item.senderName}:<br />{" "}
              {item.image ? (
                <img src={item.image} alt="image" style={{ width: 200 }} />
              ) : (
                item.message
              )}
            </b>
            <br />
            <span>{item.timestamp?.toDate().toLocaleString()}</span>
          </div>
        ) : null
      )}
      <input
        type="text"
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={send}>Send</button>
      <input type="file" onChange={(e) => fileUpload(e.target.files[0])} />
    </>
  );
}

export default Product;