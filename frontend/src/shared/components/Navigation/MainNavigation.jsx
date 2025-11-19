import React, { useState } from "react";
import { Link } from "react-router-dom";

import Backdrop from "../UIElements/Backdrop";
import MainHeader from "./MainHeader";
import "./MainNavigation.css";
import NavLinks from "./NavLinks";
import SideDrawer from "./SideDrawer";

export default function MainNavigation() {
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);

  function openDrawerHandler() {
    setDrawerIsOpen(true);
  }

  function closeDrawerHandler() {
    setDrawerIsOpen(false);
  }

  return (
    <>
      {drawerIsOpen && <Backdrop onClick={closeDrawerHandler}></Backdrop>}
      <SideDrawer show={drawerIsOpen} closeDrawer={closeDrawerHandler}>
        <nav className="main-navigation__drawer-nav">
          <NavLinks></NavLinks>
        </nav>
      </SideDrawer>

      <MainHeader>
        <button
          className="main-navigation__menu-btn"
          onClick={openDrawerHandler}
          type="button"
          aria-label="Open navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <h1 className="main-navigation__title">
          <Link to="/">Your places</Link>
        </h1>

        <nav className="main-navigation__header-nav">
          <NavLinks></NavLinks>
        </nav>
      </MainHeader>
    </>
  );
}
