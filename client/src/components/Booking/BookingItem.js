import React from "react";

const BookingItem = ({ book }) => (
  <>
    <li>{book.event.title}</li>
    <div>
      <button className="btn">Cancel Booking</button>
    </div>
  </>
);
export default BookingItem;
