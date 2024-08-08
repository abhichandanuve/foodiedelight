import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import RestaurantForm from "./components/RestaurantForm";
import RestaurantList from "./components/RestaurantList";
import axios from "axios";
import "./App.css";
const App = () => {
  const [editingRestaurant, setEditingRestaurant] = useState(null);

  const handleEdit = (restaurant) => {
    setEditingRestaurant(restaurant);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/restaurants/${id}`);
      window.location.reload();
    } catch (err) {
      console.error("Error deleting restaurant", err);
    }
  };

  return (
    <Router>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/add">Add Restaurant</Link>
      </nav>
      <Routes>
        <Route
          path="/"
          element={
            <RestaurantList onEdit={handleEdit} onDelete={handleDelete} />
          }
        />
        <Route path="/add" element={<RestaurantForm />} />
        <Route
          path="/edit"
          element={<RestaurantForm restaurant={editingRestaurant} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
