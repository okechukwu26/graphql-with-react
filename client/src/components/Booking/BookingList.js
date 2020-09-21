import React from "react";
import "./booking.css";

const BookingList = ({ booking, CancelBooking }) => (
  <>
    <ul className="booking-list">
      {booking.map((book) => (
        <li className="booking-items" key={book._id}>
          <div className="booking-item-title">
            <p>
              {book.event.title} -{" "}
              {new Date(book.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div>
            <button className="btn" onClick={() => CancelBooking(book._id)}>
              Cancel
            </button>
          </div>
        </li>
      ))}
    </ul>
  </>
);
export default BookingList;
