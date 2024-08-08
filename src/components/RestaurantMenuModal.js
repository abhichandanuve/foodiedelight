import React from "react";

const RestaurantMenuModal = ({ isOpen, onClose, restaurant }) => {
  console.log(restaurant, "restaurant");
  if (!isOpen) return null;

  return (
    <div className="modal" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>{restaurant.name} Menu</h2>
        <p>Location: {restaurant.location}</p>
        <p>Contact: {restaurant.contact}</p>
        <p>Email: {restaurant.email}</p>
        <p>Opening Hours: {restaurant.hours}</p>
        {restaurant.menu && restaurant.menu.length > 0 ? (
          <div>
            <h3>Menu</h3>
            <ul>
              {restaurant.menu.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No menu available for this restaurant.</p>
        )}
      </div>
    </div>
  );
};

export default RestaurantMenuModal;
