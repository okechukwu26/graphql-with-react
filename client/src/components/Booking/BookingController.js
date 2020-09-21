import React from "react";
import "./booking.css";

const BookingController = (props) => {
  return (
    <div className="btn-change">
      <button
        onClick={() => props.handleListChange("list")}
        className={props.activeTypeChange === "list" ? "active" : ""}
      >
        List
      </button>
      <button
        onClick={() => props.handleListChange("chart")}
        className={props.activeTypeChange === "chart" ? "active" : ""}
      >
        Chart
      </button>
    </div>
  );
};
export default BookingController;
