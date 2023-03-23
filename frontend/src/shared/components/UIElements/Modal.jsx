import React from "react";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";

import Backdrop from "./Backdrop";
import "./Modal.css";

export default function Modal(props) {
  return (
    <>
      {props.show && <Backdrop onClick={props.onCancel}></Backdrop>}
      <CSSTransition
        in={props.show}
        classNames="modal"
        mountOnEnter
        unmountOnExit
        timeout={200}
      >
        <ModalOverlay {...props}></ModalOverlay>
      </CSSTransition>
    </>
  );
}

function ModalOverlay(props) {
  const content = (
    <section className={`modal ${props.className}`} style={props.style}>
      <header className={`modal__header ${props.headerClassName}`}>
        <h2>{props.header}</h2>
      </header>
      <form
        onSubmit={props.onSubmit ? props.onSubmit : (e) => e.preventDefault()}
      >
        <section className={`modal__content ${props.contentClassName}`}>
          {props.children}
        </section>
        <footer className={`modal__footer ${props.footerCLassName}`}>
          {props.footer}
        </footer>
      </form>
    </section>
  );
  return ReactDOM.createPortal(content, document.getElementById("modal-hook"));
}
