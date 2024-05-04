import { useState, useEffect } from 'react';
import './App.css';
import { Auth } from "./components/auth";
import { db } from './config/firebase';
import { collection, getDocs } from 'firebase/firestore';

function App() {
  const [shoesList, setShoeList] = useState([]);

  useEffect(() => {
    const shoesCollectionRef = collection(db, "shoes");

    const getShoeList = async () => {
      try {
        // Read the data from Firestore
        const querySnapshot = await getDocs(shoesCollectionRef);
        const data = querySnapshot.docs.map(doc => doc.data());
        // Set the shoe list state with the fetched data
        setShoeList(data);
      } catch (err) {
        console.error(err);
      }
    }

    // Call the getShoeList function once when the component mounts
    getShoeList();
  }, []);

  return (
    <div className='App'>
      <Auth />
      {/* Render the shoe list */}
      <h2>Shoe List</h2>
      <ul>
        {shoesList.map((shoe, index) => (
          <li key={index}>{shoe.name}</li> 
        ))}
      </ul>
    </div>
  );
}

export default App;
