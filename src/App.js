import React, { Component } from "react";
import "./App.css";
import Card from "./Card.js";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: [
        { id: 1, flipped: true },
        { id: 2, flipped: false },
        { id: 3, flipped: true },
        { id: 4, flipped: false },
        { id: 5, flipped: true }
      ]
    };
  }
  onCardClicked(id) {
    this.setState({
      cards: this.state.cards.map(card => {
        if (card.id === id) {
          return { ...card, flipped: !card.flipped };
        } else {
          return card;
        }
      })
    });
  }

  render() {
    return (
      <div className="App">
        {this.state.cards.map(card => {
          return (
            <Card
              key={card.id}
              onClick={() => {
                this.onCardClicked(card.id);
              }}
              flipped={card.flipped}
            />
          );
        })}
      </div>
    );
  }
}

export default App;
