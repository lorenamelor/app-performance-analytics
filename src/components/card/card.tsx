import "./card.css";

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

const Card = ({ children }: CardProps) => {
  return <div className="card">{children}</div>;
};

export default Card;
