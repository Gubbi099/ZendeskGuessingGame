import React, { Component } from "react";
import "./App.css";
import Card from "./Card.js";
import _ from "lodash";

class App extends Component {
  constructor(props) {
    super(props);

    const themes = ["animals", "cars", "nature", "city"];
    const theme = _.sample(themes);
    console.log(theme);

    let cards = [];
    for (var i = 0; i < 7; i++) {
      cards = [
        ...cards,
        {
          pairid: i + 1,
          flipped: false,
          imgUrl: `https://loremflickr.com/220/220/${theme}?lock=${i}/`
        }
      ];
    }

    const allcards = [...cards, ...cards].map((card, index) => {
      return { ...card, uniqueId: index };
    });

    this.state = {
      cards: _.shuffle(allcards),
      theme: theme,
      currentSelectedCard: undefined,
      turns: 0
    };
  }

  hasWon = () => {
    const isEveryCardFlipped = this.state.cards.every(card => {
      return card.flipped;
    });

    this.setState({ hasWon: isEveryCardFlipped });
  };

  reset = () => {
    this.setState({
      isResetting: true,
      turns: this.state.turns + 1
    });

    setTimeout(() => {
      this.setState({
        currentSelectedCard: undefined,
        cards: this.state.cards.map(card => {
          return card.found ? card : { ...card, flipped: false };
        })
      });

      setTimeout(() => {
        this.setState({
          isResetting: false
        });
      }, 60);
    }, 1000);
  };

  updateCard(uniqueId, newCardData) {
    return new Promise(resolve => {
      this.setState(
        {
          cards: this.state.cards.map(
            card =>
              uniqueId === card.uniqueId ? { ...card, ...newCardData } : card
          )
        },
        resolve
      );
    });
  }

  async onCardClicked(clickedCard) {
    console.log(this.state.turns);
    if (clickedCard.flipped || this.state.isResetting) {
      return;
    }

    const { currentSelectedCard } = this.state;

    await this.updateCard(clickedCard.uniqueId, { flipped: true });

    if (currentSelectedCard !== undefined) {
      if (currentSelectedCard.pairid === clickedCard.pairid) {
        // A pair was found!
        await this.updateCard(currentSelectedCard.uniqueId, {
          found: true,
          flipped: true
        });
        await this.updateCard(clickedCard.uniqueId, {
          found: true,
          flipped: true
        });

        console.log(this.hasWon());
        this.reset();
      } else {
        this.reset();
      }
    } else {
      this.setState({
        currentSelectedCard: clickedCard
      });
    }
  }

  render() {
    return (
      <div className="App">
        <header className="turnHeader">
          <div>Turns used: {this.state.turns} </div>{" "}
          <div> Theme: {_.capitalize(this.state.theme)} </div>
        </header>
        {this.state.hasWon ? <div className="winScreen">You have won</div> : ""}
        <div className="cards">
          {this.state.cards.map(card => {
            return (
              <Card
                key={card.uniqueId}
                onClick={() => {
                  this.onCardClicked(card);
                }}
                flipped={card.flipped}
                image={card.imgUrl}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

export default App;
