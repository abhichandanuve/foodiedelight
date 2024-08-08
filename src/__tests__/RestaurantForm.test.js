import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import { BrowserRouter as Router } from "react-router-dom";
import RestaurantForm from "../components/RestaurantForm";

jest.mock("axios");
beforeEach(() => {
  jest.clearAllMocks();
});
const mockNavigate = jest.fn();

const setup = (restaurant = null) => {
  render(
    <Router>
      <RestaurantForm restaurant={restaurant} />
    </Router>
  );
};

describe("RestaurantForm Component", () => {
  test("renders form with initial data if provided", () => {
    const restaurant = {
      name: "Test Restaurant",
      description: "A great place to eat.",
      location: "123 Test St.",
      contact: "9235469486",
      email: "test@restaurant.com",
      hours: "9 AM - 9 PM",
      menu: ["Dish 1", "Dish 2"],
    };

    setup(restaurant);

    expect(screen.getByPlaceholderText(/Name/i).value).toBe(restaurant.name);
    expect(screen.getByPlaceholderText(/Description/i).value).toBe(
      restaurant.description
    );
    expect(screen.getByPlaceholderText(/Location/i).value).toBe(
      restaurant.location
    );
    expect(screen.getByPlaceholderText(/Contact/i).value).toBe(
      restaurant.contact
    );
    expect(screen.getByPlaceholderText(/Email/i).value).toBe(restaurant.email);
    expect(screen.getByPlaceholderText(/Opening Hours/i).value).toBe(
      restaurant.hours
    );
    expect(screen.getByText("Dish 1")).toBeInTheDocument();
    expect(screen.getByText("Dish 2")).toBeInTheDocument();
  });

  test("handles input changes", () => {
    setup();

    fireEvent.change(screen.getByPlaceholderText(/Name/i), {
      target: { value: "New Restaurant" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Description/i), {
      target: { value: "New Description" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Location/i), {
      target: { value: "456 New St." },
    });
    fireEvent.change(screen.getByPlaceholderText(/Contact/i), {
      target: { value: "9235469486" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: "new@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Opening Hours/i), {
      target: { value: "10 AM - 8 PM" },
    });

    expect(screen.getByPlaceholderText(/Name/i).value).toBe("New Restaurant");
    expect(screen.getByPlaceholderText(/Description/i).value).toBe(
      "New Description"
    );
    expect(screen.getByPlaceholderText(/Location/i).value).toBe("456 New St.");
    expect(screen.getByPlaceholderText(/Contact/i).value).toBe("9235469486");
    expect(screen.getByPlaceholderText(/Email/i).value).toBe("new@test.com");
    expect(screen.getByPlaceholderText(/Opening Hours/i).value).toBe(
      "10 AM - 8 PM"
    );
  });

  test("adds and removes menu items", () => {
    setup();

    fireEvent.change(screen.getByPlaceholderText(/Add Menu Item/i), {
      target: { value: "Dish 3" },
    });
    fireEvent.click(screen.getByText(/Add Item/i));

    expect(screen.getByText("Dish 3")).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Remove/i));

    expect(screen.queryByText("Dish 3")).not.toBeInTheDocument();
  });

  test("submits form data successfully", async () => {
    axios.post.mockResolvedValue({}); // Mock successful POST request

    setup();

    fireEvent.change(screen.getByPlaceholderText(/Name/i), {
      target: { value: "New Restaurant" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Description/i), {
      target: { value: "A great place to eat." },
    });
    fireEvent.change(screen.getByPlaceholderText(/Location/i), {
      target: { value: "123 Test St." },
    });
    fireEvent.change(screen.getByPlaceholderText(/Contact/i), {
      target: { value: "9235469486" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: "test@restaurant.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Opening Hours/i), {
      target: { value: "9 AM - 9 PM" },
    });
    fireEvent.click(screen.getByText("Add Restaurant"));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:5000/restaurants",
        {
          name: "New Restaurant",
          description: "A great place to eat.",
          location: "123 Test St.",
          contact: "9235469486",
          email: "test@restaurant.com",
          hours: "9 AM - 9 PM",
          image: "",
          menu: [],
        }
      );
    });
  });

  test("handles form submission errors", async () => {
    axios.post.mockRejectedValue(new Error("Error saving restaurant.")); // Mock failed POST request

    setup();

    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "New Restaurant" },
    });
    fireEvent.click(screen.getByText("Add Restaurant"));
  });

  test("validates required fields", async () => {
    setup();

    fireEvent.click(screen.getByText("Add Restaurant"));

    await waitFor(() => {
      expect(screen.getByText("All fields are required.")).toBeInTheDocument();
    });
  });

  test("handles image upload", () => {
    setup();

    const file = new File(["dummy content"], "test-image.jpg", {
      type: "image/jpeg",
    });
    fireEvent.change(screen.getByLabelText("Choose File"), {
      target: { files: [file] },
    });

    expect(screen.getByLabelText("Choose File").files[0]).toBe(file);
  });
});
