const Booking = require("../../model/booking");
const Event = require("../../model/event");
const { transformBooking, transFormEvent } = require("./merge");

module.exports = {
  booking: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated");
    }
    try {
      const books = await Booking.find({ user: req.userId });
      return books.map((book) => {
        return transformBooking(book);
      });
    } catch (error) {
      throw error;
    }
  },

  createBooking: async ({ eventId }, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated");
    }
    try {
      const event = await Event.findOne({ _id: eventId });
      const book = new Booking({
        user: req.userId,
        event: event,
      });
      const result = await book.save();

      return transformBooking(result);
    } catch (error) {
      throw error;
    }
  },
  cancelBooking: async ({ bookingId }, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated");
    }
    try {
      const booking = await Booking.findById(bookingId).populate("event");
      const event = transFormEvent(booking.event);
      await Booking.findByIdAndDelete(bookingId);
      return event;
    } catch (error) {
      throw error;
    }
  },
};
