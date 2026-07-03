import "./iconLabel.css";

type IconLabelProps = {
  icon: string;
  label: string;
};

const IconLabel = ({ icon, label }: IconLabelProps) => {
  return (
    <div className="iconLabel">
      <img
        src={icon}
        alt=""
        aria-hidden
        loading="lazy"
        className="iconLabel__icon"
      />
      <span>{label}</span>
    </div>
  );
};

export default IconLabel;
