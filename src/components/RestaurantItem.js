import React from "react";

const RestaurantItem = ({ restaurant, onEdit, onDelete, onClick }) => {
  return (
    <div className="restaurant-item" onClick={() => onClick(restaurant)}>
      <h3>{restaurant.name}</h3>
      <p>{restaurant.description}</p>
      <p>{restaurant.location}</p>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit(restaurant);
        }}
      >
        Edit
      </button>
      <button
        className="delete"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(restaurant.id);
        }}
      >
        Delete
      </button>
    </div>
  );
};

export default RestaurantItem;
