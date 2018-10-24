import React, { Component } from "react";
import "./App.css";
import Card from "./Card.js";
import _ from "lodash";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    this.generateDeck();
  }

  generateDeck = (settings = { zoom: 0.85, cardCount: 10 }) => {
    const themes = [
      "cats",
      "cars",
      "nature",
      "city",
      "zendesk",
      "thematrix",
      "obama"
    ];
    const theme = _.sample(themes);

    let cards = [];
    for (var i = 0; i < settings.cardCount; i++) {
      cards = [
        ...cards,
        {
          pairid: i + 1,
          flipped: false,
          imgUrl: `https://loremflickr.com/220/220/${theme}?lock=${i + 10}/`
        }
      ];
    }

    const allcards = [...cards, ...cards].map((card, index) => {
      return { ...card, uniqueId: index };
    });

    this.setState({
      cards: _.shuffle(allcards),
      theme: theme,
      currentSelectedCard: undefined,
      cardCount: settings.cardCount,
      turns: 0,
      misses: 0,
      zoom: settings.zoom,
      maxMisses: Math.round(settings.cardCount * 1.5)
    });
  };

  hasWon = () => {
    const isEveryCardFlipped = this.state.cards.every(card => {
      return card.flipped;
    });

    this.setState({ hasWon: isEveryCardFlipped });

    return isEveryCardFlipped;
  };

  hasLost = () => {
    const lost = this.state.misses >= this.state.maxMisses;

    this.setState({ hasLost: lost });
  };

  endGame = () => {
    this.setState({
      hasWon: false,
      cards: this.state.cards.map(card => ({ ...card, flipped: false }))
    });

    setTimeout(() => this.generateDeck({ zoom: this.state.zoom }), 600);
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

      this.setState({
        isResetting: false
      });
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
    if (
      clickedCard.flipped ||
      this.state.isResetting ||
      this.state.hasWon ||
      this.state.hasLost
    ) {
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

        this.hasWon() || this.hasLost();
        this.reset();
      } else {
        this.setState({ misses: this.state.misses + 1 });
        this.hasLost();
        this.reset();
      }
    } else {
      this.setState({
        currentSelectedCard: clickedCard
      });
    }
  }

  render() {
    if (!this.state.cards) return null;

    return (
      <div className="App">
        <header className="turnHeader">
          <div className="missed">
            Missed: {this.state.misses} / {this.state.maxMisses}
          </div>
          <input
            value={this.state.zoom}
            type="range"
            step="0.0001"
            min="0.3"
            max="1.3"
            onChange={evt => {
              this.setState({ zoom: evt.target.value });
            }}
          />
          <div> Theme: {_.capitalize(this.state.theme)} </div>
        </header>
        {(this.state.hasWon || this.state.hasLost) && (
          <div className="winScreen">
            {this.state.hasWon && (
              <div>
                <div>You won!</div>
                <div className="winTurns">Turns: {this.state.turns}</div>
              </div>
            )}
            {this.state.hasLost && "You lost!"}
            <button className="button" onClick={this.endGame}>
              Retry
            </button>
          </div>
        )}
        <div className="settings">
          Settings{" "}
          <input
            value={this.state.cardCount}
            type="range"
            step="1"
            min="4"
            max="20"
            onChange={evt => {
              this.generateDeck({ cardCount: evt.target.value });
            }}
          />
        </div>
        <div className="cards" style={{ zoom: this.state.zoom }}>
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
