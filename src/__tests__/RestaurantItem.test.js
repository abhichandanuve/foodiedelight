import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import RestaurantItem from "../components/RestaurantItem";

describe("RestaurantItem Component", () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnClick = jest.fn();

  const restaurant = {
    id: 1,
    name: "Test Restaurant",
    description: "A great place to eat.",
    location: "123 Test St.",
  };

  test("renders restaurant details", () => {
    render(
      <RestaurantItem
        restaurant={restaurant}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onClick={mockOnClick}
      />
    );

    expect(screen.getByText("Test Restaurant")).toBeInTheDocument();
    expect(screen.getByText("A great place to eat.")).toBeInTheDocument();
    expect(screen.getByText("123 Test St.")).toBeInTheDocument();
  });

  test("calls onClick with restaurant details when restaurant item is clicked", () => {
    render(
      <RestaurantItem
        restaurant={restaurant}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onClick={mockOnClick}
      />
    );

    fireEvent.click(screen.getByText("Test Restaurant"));

    expect(mockOnClick).toHaveBeenCalledWith(restaurant);
  });

  test("calls onEdit with restaurant details when Edit button is clicked", () => {
    render(
      <RestaurantItem
        restaurant={restaurant}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onClick={mockOnClick}
      />
    );

    fireEvent.click(screen.getByText("Edit"));

    expect(mockOnEdit).toHaveBeenCalledWith(restaurant);
  });

  test("calls onDelete with restaurant id when Delete button is clicked", () => {
    render(
      <RestaurantItem
        restaurant={restaurant}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onClick={mockOnClick}
      />
    );

    fireEvent.click(screen.getByText("Delete"));

    expect(mockOnDelete).toHaveBeenCalledWith(restaurant.id);
  });

  test("stops event propagation for Edit and Delete buttons", () => {
    render(
      <RestaurantItem
        restaurant={restaurant}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onClick={mockOnClick}
      />
    );

    fireEvent.click(screen.getByText("Edit"));
    fireEvent.click(screen.getByText("Delete"));

    expect(mockOnClick).not.toHaveBeenCalled();
  });
});
