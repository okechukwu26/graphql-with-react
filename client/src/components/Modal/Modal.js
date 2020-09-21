import React from "react";
import "./modal.css";

const Modal = (props) => (
  <div className="modal">
    <header className="modal-heading">
      <h1>{props.title}</h1>
    </header>
    <section className="modal-content">{props.children}</section>
    <section className="modal-actions">
      {props.canCancel && (
        <button type="button" className="btn" onClick={props.onCancel}>
          Cancel
        </button>
      )}
      {props.canConfirm && (
        <button type="button" className="btn" onClick={props.onConfirm}>
          {props.confirmText}
        </button>
      )}
    </section>
  </div>
);

export default Modal;
