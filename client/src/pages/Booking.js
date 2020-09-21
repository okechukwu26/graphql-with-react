import React, { Component } from "react";
import AuthContext from "../context/AuthContext";
import Spinner from "../components/spinner/Spinner";
import BookingList from "../components/Booking/BookingList";
import BookingChart from "../components/Booking/BookingChart";
import BookingController from "../components/Booking/BookingController";

export class Booking extends Component {
  static contextType = AuthContext;
  state = {
    isLoading: false,
    Booking: [],
    output: "list",
  };
  componentDidMount() {
    this.fetchBooking();
  }
  fetchBooking = () => {
    const token = this.context.token;
    this.setState({ isLoading: true });
    const request = {
      query: `
      query{
        booking{
          _id
          updatedAt
          createdAt
          event{
            title
            price
          }
        }
      }
      `,
    };
    fetch("http://localhost:4000/graphql", {
      method: "POST",
      body: JSON.stringify(request),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("failed");
        }
        return res.json();
      })
      .then((resData) => {
        const Booking = resData.data.booking;
        this.setState({ Booking, isLoading: false });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ isLoading: false });
      });
  };
  CancelBooking = (bookId) => {
    const token = this.context.token;
    const request = {
      query: `
      mutation cancelBooking($id:ID!){
        cancelBooking(bookingId:$id){
           _id
           title
           description
            
          
        }
      }
      
      `,
      variables: {
        id: bookId,
      },
    };
    fetch("http://localhost:4000/graphql", {
      method: "POST",
      body: JSON.stringify(request),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("failed");
        }
        return res.json();
      })
      .then((resData) => {
        this.setState((prevState) => {
          const updateBooking = prevState.Booking.filter(
            (book) => book._id !== bookId
          );
          return { Booking: updateBooking };
        });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ isLoading: false });
      });
  };
  handleListChange = (output) => {
    if (output === "list") {
      this.setState({ output: "list" });
    } else {
      this.setState({ output: "chart" });
    }
  };

  render() {
    let content = <Spinner />;
    if (!this.state.isLoading) {
      content = (
        <>
          <BookingController
            activeTypeChange={this.state.output}
            handleListChange={this.handleListChange}
          />

          <div>
            {this.state.output === "list" ? (
              <BookingList
                booking={this.state.Booking}
                CancelBooking={this.CancelBooking}
              />
            ) : (
              <BookingChart booking={this.state.Booking} />
            )}
          </div>
        </>
      );
    }
    return content;
  }
}

export default Booking;
