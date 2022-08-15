import React from "react";
import "./Loading.scss";

interface LoadingProps {
  size?: "large" | "medium" | "small";
  color?: string;
}

const Loading: React.FC<LoadingProps> = ({ size, color }) => {
  return (
    <div
      className={`loading ${size ? size : ""}`}
      style={{ "--color": color ? color : "#fff" } as React.CSSProperties}
    >
      <div className="d1" />
      <div className="d2" />
    </div>
  );
};

export default Loading;
