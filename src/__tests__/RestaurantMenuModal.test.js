import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import RestaurantMenuModal from "../components/RestaurantMenuModal";

describe("RestaurantMenuModal", () => {
  const mockRestaurant = {
    id: 1,
    name: "Test Restaurant",
    description: "A great place to eat.",
    location: "123 Test St.",
    contact: "555-1234",
    email: "test@restaurant.com",
    hours: "9 AM - 9 PM",
    menu: ["Dish 1", "Dish 2", "Dish 3"],
  };

  test("renders the modal with restaurant details", () => {
    render(
      <RestaurantMenuModal
        isOpen={true}
        onClose={() => {}}
        restaurant={mockRestaurant}
      />
    );

    expect(screen.getByText(/Test Restaurant/i)).toBeInTheDocument();
  });

  test("renders the menu items", () => {
    render(
      <RestaurantMenuModal
        isOpen={true}
        onClose={() => {}}
        restaurant={mockRestaurant}
      />
    );

    expect(screen.getByText("Menu")).toBeInTheDocument();

    mockRestaurant.menu.forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  test("displays a message when no menu items are available", () => {
    const restaurantWithoutMenu = { ...mockRestaurant, menu: [] };

    render(
      <RestaurantMenuModal
        isOpen={true}
        onClose={() => {}}
        restaurant={restaurantWithoutMenu}
      />
    );

    expect(
      screen.getByText("No menu available for this restaurant.")
    ).toBeInTheDocument();
  });

  test("does not render the modal when isOpen is false", () => {
    const { queryByText } = render(
      <RestaurantMenuModal
        isOpen={false}
        onClose={() => {}}
        restaurant={mockRestaurant}
      />
    );

    expect(queryByText("Test Restaurant")).not.toBeInTheDocument();
  });

  test("calls onClose when the close button is clicked", () => {
    const mockOnClose = jest.fn();

    render(
      <RestaurantMenuModal
        isOpen={true}
        onClose={mockOnClose}
        restaurant={mockRestaurant}
      />
    );

    const closeButton = screen.getByText("×");
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test("closes modal when clicking outside of the modal content", () => {
    const mockOnClose = jest.fn();

    const { getByRole } = render(
      <RestaurantMenuModal
        isOpen={true}
        onClose={mockOnClose}
        restaurant={mockRestaurant}
      />
    );

    fireEvent.click(getByRole("dialog"));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
