import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RestaurantForm = ({ restaurant }) => {
  const [name, setName] = useState(restaurant ? restaurant.name : "");
  const [description, setDescription] = useState(
    restaurant ? restaurant.description : ""
  );
  const [location, setLocation] = useState(
    restaurant ? restaurant.location : ""
  );
  const [contact, setContact] = useState(restaurant ? restaurant.contact : "");
  const [email, setEmail] = useState(restaurant ? restaurant.email : "");
  const [hours, setHours] = useState(restaurant ? restaurant.hours : "");
  const [image, setImage] = useState(null);
  const [menu, setMenu] = useState(restaurant?.menu || []);
  const [menuItem, setMenuItem] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (restaurant) {
      setName(restaurant.name);
      setDescription(restaurant.description);
      setLocation(restaurant.location);
      setContact(restaurant.contact);
      setEmail(restaurant.email);
      setHours(restaurant.hours);
      setMenu(restaurant.menu || []);
    }
  }, [restaurant]);

  const isValidContactNumber = (number) => {
    const phoneRegex = /^[7-9]\d{9}$/;
    return phoneRegex.test(number);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !description || !location || !contact || !email || !hours) {
      setError("All fields are required.");
      return;
    }
    if (!isValidContactNumber(contact)) {
        setError('Invalid contact number. It should be 10 digits long and start with 7, 8, or 9.');
        return;
      }
    const formData = {
      name,
      description,
      location,
      contact,
      email,
      hours,
      image: image ? URL.createObjectURL(image) : "",
      menu: menu,
    };
    try {
      if (restaurant) {
        await axios.put(
          `http://localhost:5000/restaurants/${restaurant.id}`,
          formData
        );
      } else {
        await axios.post("http://localhost:5000/restaurants", formData);
      }
      navigate("/");
    } catch (err) {
      setError("Error saving restaurant.");
    }
  };
  const addMenuItem = () => {
    if (menuItem) {
      setMenu([...menu, menuItem]);
      setMenuItem("");
    }
  };

  const removeMenuItem = (index) => {
    setMenu(menu.filter((_, i) => i !== index));
  };
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <input
        type="text"
        placeholder="Contact"
        value={contact}
        onChange={(e) => setContact(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="text"
        placeholder="Opening Hours"
        value={hours}
        onChange={(e) => setHours(e.target.value)}
      />
      <div className="menu-section">
        <h3>Menu Items</h3>
        <div className="menu-input-group">
          <input
            type="text"
            placeholder="Add Menu Item"
            value={menuItem}
            onChange={(e) => setMenuItem(e.target.value)}
          />
          <button style={{ width: "50%" }} type="button" onClick={addMenuItem}>
            Add Item
          </button>
        </div>
        <ul className="menu-list">
          {menu.map((item, index) => (
            <li key={index}>
              {item}
              <button
                style={{ width: "50%" }}
                type="button"
                onClick={() => removeMenuItem(index)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
      <input
        aria-label="Choose File"
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
      />
      {error && <p>{error}</p>}
      <button type="submit">{restaurant ? "Update" : "Add"} Restaurant</button>
    </form>
  );
};

export default RestaurantForm;
