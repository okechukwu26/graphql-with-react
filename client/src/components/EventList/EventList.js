import React from "react";
import EventItem from "./EventItem";
function EventList({ events, authId, onView }) {
  const eventList = events.map((event) => {
    return (
      <EventItem
        key={event._id}
        events={event}
        userId={authId}
        viewDetail={onView}
      />
    );
  });
  return <ul className="event-list">{eventList}</ul>;
}

export default EventList;
