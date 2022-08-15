import React from "react";
import { IconType } from "react-icons";
import Loading from "../loading/Loading";
import "./Button.scss";

interface ButtonProps {
  onClick?: () => void;
  text?: string;
  LeftIcon?: IconType;
  RightIcon?: IconType;
  outlined?: boolean;
  textbtn?: boolean;
  disabled?: boolean;
  fullwidth?: boolean;
  color?: "danger" | "success" | "warning" | "default" | "grey" | "discord";
  submit?: boolean;
  loading?: boolean;
  centered?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  text,
  LeftIcon,
  RightIcon,
  color,
  disabled,
  fullwidth,
  loading,
  outlined,
  submit,
  textbtn,
  centered,
}) => {
  const textColor = color ? color : "#2980b9";
  let loadingColor = outlined || textbtn ? textColor : "#fff";

  if (loadingColor === "danger") loadingColor = "#e74c3c";

  return (
    <button
      onClick={onClick}
      className={`button${fullwidth ? " fullwidth" : ""}${
        outlined ? " outlined" : ""
      }${textbtn ? " text" : ""}${!centered ? " not-centered" : ""} ${
        color || ""
      }`}
      {...(submit ? { type: "submit" } : { type: "button" })}
      {...(disabled ? { disabled: true } : {})}
    >
      {LeftIcon && (
        <div className="button-lefticon">
          <LeftIcon />
        </div>
      )}

      {text && <div className="button-text">{text}</div>}

      {loading ? (
        <Loading size="small" color={loadingColor} />
      ) : (
        RightIcon && (
          <div className="button-righticon">
            <RightIcon />
          </div>
        )
      )}
    </button>
  );
};

export default Button;
