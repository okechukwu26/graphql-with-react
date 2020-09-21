import React from "react";

function EventItem({ events, userId, viewDetail }) {
  return (
    <li className="event-list-item">
      <div>
        <h1>{events.title}</h1>
        <h2>
          ${events.price} - {new Date(events.date).toLocaleDateString()}
        </h2>
      </div>
      <div>
        {events.creator._id === userId ? (
          <p>you are the owner of this event</p>
        ) : (
          <button className="btn" onClick={() => viewDetail(events._id)}>
            view detail
          </button>
        )}
      </div>
    </li>
  );
}

export default EventItem;
