import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders learn react link", () => {
  render(<App />);
  const linkElement = screen.getByText("Home");
  expect(linkElement).toBeInTheDocument();
  const element = screen.getByText("Add Restaurant");
  expect(element).toBeInTheDocument();
});
