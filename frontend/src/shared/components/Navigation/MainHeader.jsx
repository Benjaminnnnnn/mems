import React from "react";

import "./MainHeader.css";

export default function MainHeader(props) {
  return (
    <header className="main-header">
      <div className="main-header__inner">{props.children}</div>
    </header>
  );
}
