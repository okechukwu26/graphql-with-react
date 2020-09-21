const Event = require("../../model/event");
const User = require("../../model/user");
const dataLoader = require("dataloader");
const { dateToString } = require("../../helper/date");
const eventLoader = new dataLoader((eventIds) => {
  return event(eventIds);
});
const userLoader = new dataLoader((userId) => {
  return User.find({ _id: { $in: userId } });
});

const transFormEvent = (event) => {
  return {
    ...event._doc,
    _id: event.id,
    date: dateToString(event._doc.date),
    creator: user.bind(this, event.creator),
  };
};
const transformBooking = (book) => {
  return {
    ...book._doc,
    _id: book.id,
    event: singleEvent.bind(this, book._doc.event),
    user: user.bind(this, book._doc.user),
    createdAt: dateToString(book._doc.createdAt),
    updatedAt: dateToString(book._doc.updatedAt),
  };
};

const event = async (eventsId) => {
  try {
    const events = await Event.find({ _id: { $in: eventsId } });
    events.sort((a, b) => {
      return (
        eventsId.indexOf(a._id.toString()) - eventsId.indexOf(b._id.toString())
      );
    });
    return events.map((event) => {
      return transFormEvent(event);
    });
  } catch (error) {
    throw error;
  }
};
const singleEvent = async (eventId) => {
  try {
    const event = await eventLoader.load(eventId.toString());
    return event;
  } catch (error) {
    throw error;
  }
};
const user = async (userId) => {
  try {
    const user = await userLoader.load(userId.toString());

    return {
      ...user._doc,
      _id: user.id,
      createdEvents: () => eventLoader.loadMany(user._doc.createdEvents),
    };
  } catch (error) {
    throw error;
  }
};

exports.transFormEvent = transFormEvent;
exports.transformBooking = transformBooking;
