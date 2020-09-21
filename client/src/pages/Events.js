import React, { Component } from "react";
import "./Events.css";
import Modal from "../components/Modal/Modal";
import Backdrop from "../components/backdrop/Backdrop";
import AuthContext from "../context/AuthContext";
import EventList from "../components/EventList/EventList";
import Spinner from "../components/spinner/Spinner";
export class Events extends Component {
  static contextType = AuthContext;
  state = {
    open: false,
    events: [],
    isLoading: false,
    SelectedEvent: null,
  };
  constructor(props) {
    super(props);
    this.title = React.createRef();
    this.price = React.createRef();
    this.description = React.createRef();
    this.date = React.createRef();
  }
  isActive = true;
  componentDidMount() {
    this.fetchEvents();
  }
  componentWillUnmount() {
    this.isActive = false;
  }
  createEvent = () => {
    this.setState({ open: true });
  };
  handleCancel = () => {
    this.setState({ open: false, SelectedEvent: null });
  };
  showDetail = (eventId) => {
    this.setState((prevState) => {
      const SelectedEvent = prevState.events.find((e) => e._id === eventId);

      return { SelectedEvent };
    });
  };
  SelectedModal = () => {
    if (!this.context.token) {
      this.setState({ SelectedEvent: null });
      return;
    }
    const request = {
      query: `
     mutation createBooking($id:ID!){
       createBooking(eventId: $id){
         _id
          createdAt
          updatedAt
       }
     }`,
      variables: {
        id: this.state.SelectedEvent._id,
      },
    };
    fetch(`http://localhost:4000/graphql`, {
      method: "POST",
      body: JSON.stringify(request),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.context.token}`,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("failed");
        }
        return res.json();
      })
      .then((resData) => {
        console.log(resData);
        this.setState({ SelectedEvent: null });
      })

      .catch((err) => {
        console.log(err);
      });
  };
  handleConfirm = () => {
    this.setState({ open: false });
    const title = this.title.current.value,
      description = this.description.current.value,
      price = +this.price.current.value,
      date = this.date.current.value;
    if (
      title.trim().length === 0 ||
      description.trim().length === 0 ||
      price <= 0 ||
      date.trim().length === 0
    ) {
      return;
    }
    const event = { price, title, description, date };
    console.log(event);

    const token = this.context.token;
    console.log(token);
    const requestBody = {
      query: `
        mutation createdEvents ($title:String!, $description:String!,$price:Float!, $date:String!){
          createEvent(eventInput: {title:$title, description:$description, price:$price, date:$date} ){
            _id
            title
            description
            date
            price
           
          }
        }
        `,
      variables: {
        title,
        description,
        price,
        date,
      },
    };

    fetch("http://localhost:4000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
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
          const updatedEvents = [...prevState.events];
          updatedEvents.push({
            _id: resData.data.createEvent._id,
            title: resData.data.createEvent.title,
            description: resData.data.createEvent.description,
            price: resData.data.createEventprice,
            data: resData.data.createEvent.data,
            creator: {
              _id: this.context.userId,
            },
          });
          return { events: updatedEvents };
        });
      })

      .catch((err) => {
        console.log(err);
      });
  };
  fetchEvents() {
    this.setState({ isLoading: true });
    const request = {
      query: `
     query{
       events{
         _id
         price
         date
         description
         title
        creator{
          email
          _id
        }
       }
     }`,
    };
    fetch("http://localhost:4000/graphql", {
      method: "POST",
      body: JSON.stringify(request),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("failed");
        }
        return res.json();
      })
      .then((resData) => {
        const events = resData.data.events;
        if (this.isActive) {
          this.setState({ events: events, isLoading: false });
        }
      })

      .catch((err) => {
        if (this.isActive) {
          console.log(err);
          this.setState({ isLoading: false });
        }
      });
  }
  render() {
    return (
      <>
        {(this.state.open || this.state.SelectedEvent) && <Backdrop />}
        {this.state.open && (
          <Modal
            title="Add Event"
            canCancel
            canConfirm
            onCancel={this.handleCancel}
            onConfirm={this.handleConfirm}
            confirmText="Confirm"
          >
            <form className="modal-form">
              <div className="form-control">
                <label htmlFor="title">Title</label>
                <input type="text" id="title" ref={this.title} />
              </div>
              <div className="form-control">
                <label htmlFor="price">price</label>
                <input type="number" id="price" ref={this.price} />
              </div>
              <div className="form-control">
                <label htmlFor="date">Date</label>
                <input type="datetime-local" id="date" ref={this.date} />
              </div>
              <div className="form-control">
                <label htmlFor="description">description</label>
                <textarea
                  type="text"
                  rows="4"
                  id="description"
                  ref={this.description}
                />
              </div>
            </form>
          </Modal>
        )}
        {this.state.SelectedEvent && (
          <Modal
            title={this.state.SelectedEvent.title}
            canCancel
            canConfirm
            onCancel={this.handleCancel}
            onConfirm={this.SelectedModal}
            confirmText={this.context.token ? "Book" : "confirm"}
          >
            <h1>{this.state.SelectedEvent.title}</h1>
            <h2>
              {this.state.SelectedEvent.price} -{" "}
              {new Date(this.state.SelectedEvent.date).toLocaleDateString()}
            </h2>
            <p>{this.state.SelectedEvent.description}</p>
          </Modal>
        )}
        {this.context.token && (
          <div className="event-control">
            <p>Share your own event</p>
            <button className="btn" onClick={this.createEvent}>
              Create Event
            </button>
          </div>
        )}
        {this.state.isLoading ? (
          <Spinner />
        ) : (
          <EventList
            events={this.state.events}
            authId={this.context.userId}
            onView={this.showDetail}
          />
        )}
      </>
    );
  }
}

export default Events;
