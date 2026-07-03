import { render, screen } from "@testing-library/react";
import IconLabel from "./iconLabel";

describe("IconLabel", () => {
  it("renders the icon and label", () => {
    const { container } = render(
      <IconLabel
        label="Clash of Clans"
        icon="https://example.com/icon.png"
      />,
    );

    expect(screen.getByText("Clash of Clans")).toBeInTheDocument();
    const icon = container.querySelector(".iconLabel__icon");
    expect(icon).toHaveAttribute("src", "https://example.com/icon.png");
    expect(icon).toHaveAttribute("alt", "");
    expect(icon).toHaveAttribute("aria-hidden");
  });
});
