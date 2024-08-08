import React, { useState, useEffect } from "react";
import axios from "axios";
import RestaurantItem from "./RestaurantItem";
import { useNavigate } from "react-router-dom";
import RestaurantMenuModal from "./RestaurantMenuModal";

const RestaurantList = ({ onEdit, onDelete }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get("http://localhost:5000/restaurants");
        setRestaurants(response.data);
      } catch (err) {
        console.error("Error fetching restaurants", err);
      }
    };
    fetchRestaurants();
  }, []);

  const handleRestaurantClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedRestaurant(null);
  };

  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(search.toLowerCase())
  );
  const handleEditClick = (restaurant) => {
    onEdit(restaurant);
    navigate("/edit");
  };
  return (
    <div>
      <input
        type="text"
        placeholder="Search restaurants"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="restaurant-list">
        {filteredRestaurants.map((restaurant) => (
          <RestaurantItem
            key={restaurant.id}
            restaurant={restaurant}
            onEdit={handleEditClick}
            onDelete={onDelete}
            onClick={handleRestaurantClick}
          />
        ))}
      </div>
      {selectedRestaurant && (
        <RestaurantMenuModal
          isOpen={isModalOpen}
          onClose={closeModal}
          restaurant={selectedRestaurant}
        />
      )}
    </div>
  );
};

export default RestaurantList;
