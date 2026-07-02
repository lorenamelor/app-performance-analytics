import { render, screen } from "@testing-library/react";
import IconLabel from "./iconLabel";

describe("IconLabel", () => {
  it("renders the icon and label", () => {
    render(
      <IconLabel
        label="Clash of Clans"
        icon="https://example.com/icon.png"
      />,
    );

    expect(screen.getByText("Clash of Clans")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Clash of Clans" })).toHaveAttribute(
      "src",
      "https://example.com/icon.png",
    );
  });
});
