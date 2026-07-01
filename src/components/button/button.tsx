import type { ButtonHTMLAttributes } from "react";
import "./button.css";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  selected?: boolean;
};

const Button = ({
  selected = false,
  type = "button",
  className,
  children,
  ...rest
}: ButtonProps) => {
  const classNames = ["button", selected ? "button--selected" : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <button type={type} className={classNames} {...rest}>
      {children}
    </button>
  );
};

export default Button;
