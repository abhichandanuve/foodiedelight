import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import RestaurantList from "../components/RestaurantList";

jest.mock("axios");

jest.mock(
  "../components/RestaurantItem",
  () =>
    ({ restaurant, onEdit, onDelete, onClick }) =>
      (
        <div onClick={() => onClick(restaurant)} data-testid="restaurant-item">
          <h3>{restaurant.name}</h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(restaurant);
            }}
          >
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(restaurant.id);
            }}
          >
            Delete
          </button>
        </div>
      )
);

jest.mock(
  "../components/RestaurantMenuModal",
  () =>
    ({ isOpen, onClose, restaurant }) =>
      isOpen ? (
        <div role="dialog">
          <h2>{restaurant.name}</h2>
          <button onClick={onClose}>Close</button>
        </div>
      ) : null
);

describe("RestaurantList Component", () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: [
        {
          id: 1,
          name: "Restaurant 1",
          description: "Description 1",
          location: "Location 1",
        },
        {
          id: 2,
          name: "Restaurant 2",
          description: "Description 2",
          location: "Location 2",
        },
      ],
    });
  });

  test("renders the list of restaurants", async () => {
    render(
      <MemoryRouter>
        <RestaurantList onEdit={mockOnEdit} onDelete={mockOnDelete} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Restaurant 1")).toBeInTheDocument();
      expect(screen.getByText("Restaurant 2")).toBeInTheDocument();
    });
  });

  test("filters restaurants based on search input", async () => {
    render(
      <MemoryRouter>
        <RestaurantList onEdit={mockOnEdit} onDelete={mockOnDelete} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Restaurant 1")).toBeInTheDocument();
      expect(screen.getByText("Restaurant 2")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText("Search restaurants"), {
      target: { value: "1" },
    });

    expect(screen.getByText("Restaurant 1")).toBeInTheDocument();
    expect(screen.queryByText("Restaurant 2")).toBeNull();
  });

  test("opens the modal with restaurant details when a restaurant is clicked", async () => {
    render(
      <MemoryRouter>
        <RestaurantList onEdit={mockOnEdit} onDelete={mockOnDelete} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Restaurant 1")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Restaurant 1"));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getAllByText("Restaurant 1")[0]).toBeInTheDocument();
  });

  test("calls onEdit and onDelete when buttons are clicked", async () => {
    render(
      <MemoryRouter>
        <RestaurantList onEdit={mockOnEdit} onDelete={mockOnDelete} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Restaurant 1")).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByText("Edit")[0]);

    expect(mockOnEdit).toHaveBeenCalledWith({
      id: 1,
      name: "Restaurant 1",
      description: "Description 1",
      location: "Location 1",
    });

    fireEvent.click(screen.getAllByText("Delete")[0]);

    expect(mockOnDelete).toHaveBeenCalledWith(1);
  });

  test("closes the modal when close button is clicked", async () => {
    render(
      <MemoryRouter>
        <RestaurantList onEdit={mockOnEdit} onDelete={mockOnDelete} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Restaurant 1")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Restaurant 1"));

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Close"));

    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
