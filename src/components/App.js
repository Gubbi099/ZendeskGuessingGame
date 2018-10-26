import React, { Component } from "react";
import "./App.css";
import Card from "./Card.js";
import Timer from "./Timer.js";
import _ from "lodash";
import { startConfetti, stopConfetti } from "../confetti.js";
import { startRain, stopRain } from "../rain.js";
import { startTimer, getElapsedTime } from "../timer.js";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    window.setInterval(() => {
      this.setState({ elapsedTime: getElapsedTime() });
    }, 1000);
    this.generateDeck();
  }

  // The function that loads the game
  generateDeck = (settings = { zoom: 0.85, cardCount: 10 }) => {
    startTimer();
    // Themes
    const themes = [
      "cats",
      "cars",
      "nature",
      "city",
      "zendesk",
      "trump",
      "obama"
    ];
    const currentTheme = settings.theme || _.sample(themes);

    let cards = [];
    for (var i = 0; i < settings.cardCount; i++) {
      cards = [
        ...cards,
        {
          pairid: i + 1,
          flipped: false,
          imgUrl: `https://loremflickr.com/220/220/${currentTheme}?lock=${i}/`
        }
      ];
    }

    // Grabs all the cards
    const allcards = [...cards, ...cards].map((card, index) => {
      return { ...card, uniqueId: index };
    });

    // All the states
    this.setState({
      cards: _.shuffle(allcards),
      theme: currentTheme,
      currentSelectedCard: undefined,
      cardCount: settings.cardCount,
      turns: 0,
      misses: 0,
      zoom: settings.zoom,
      maxMisses: Math.round(settings.cardCount * 1.5)
    });
  };

  // Checks if all cards have flipped then sets hasWon to true
  hasWon = () => {
    const isEveryCardFlipped = this.state.cards.every(card => {
      return card.flipped;
    });

    this.setState({ hasWon: isEveryCardFlipped });
    if (isEveryCardFlipped) {
      startConfetti();
    }
    return isEveryCardFlipped;
  };

  // Checks if the misses are higher that the maximum amount and if so then it will set the state to lost
  hasLost = () => {
    const lost = this.state.misses >= this.state.maxMisses;

    this.setState({ hasLost: lost });

    if (lost) {
      startRain();
    }

    return lost;
  };

  // Ends the game
  endGame = () => {
    if (this.state.hasWon) {
      stopConfetti();
    } else {
      stopRain();
    }
    this.setState({
      hasWon: false,
      hasLost: false,
      cards: this.state.cards.map(card => ({ ...card, flipped: false }))
    });

    setTimeout(
      () =>
        this.generateDeck({
          zoom: this.state.zoom,
          cardCount: this.state.cardCount
        }),
      600
    );
  };

  // Reset function
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
        this.hasLost() || this.reset();
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
        <header className="header">
          <div className="innerHeader">
            <div className="missedHeader">
              Missed: {this.state.misses} / {this.state.maxMisses}{" "}
              <Timer time={this.state.elapsedTime} />
            </div>
            <div className="websiteTitle">ZENGUESS</div>
            <div className="themeHeader">
              Theme: {_.capitalize(this.state.theme)}
            </div>
          </div>
          <div className="gradient" />
        </header>
        {(this.state.hasWon || this.state.hasLost) && (
          <div className="winScreen">
            {this.state.hasWon && (
              <div>
                <div>You win!</div>
                <div className="winTurns">Turns: {this.state.turns}</div>
              </div>
            )}
            {this.state.hasLost && "You lose"}
            <button className="button" onClick={this.endGame}>
              Retry
            </button>
          </div>
        )}
        <div
          className={"settings" + (this.state.settingsIsOpen ? " is-open" : "")}
        >
          <div className="settingsBackground">
            <div className="settingsTitle">Settings</div>
            <div className="settingcontrol">
              Card Amount
              <input
                value={this.state.cardCount}
                className="slider"
                type="range"
                step="1"
                min="5"
                max="20"
                onChange={evt => {
                  this.setState({ cardCount: evt.target.value });
                }}
              />
              <div className="settingCount"> {this.state.cardCount * 2} </div>
            </div>
            <div className="settingcontrol">
              Zoom Amount
              <input
                value={this.state.zoom}
                className="slider"
                type="range"
                step="0.0001"
                min="0.3"
                max="1.3"
                onChange={evt => {
                  this.setState({ zoom: evt.target.value });
                }}
              />
            </div>
            <div className="settingcontrol">
              Theme
              <input
                maxLength="9"
                className="textBox"
                type="text"
                value={this.state.theme}
                onChange={evt => {
                  this.setState({ theme: evt.target.value });
                }}
              />
            </div>
            <button
              className="applysettings"
              onClick={() => {
                this.setState({ settingsIsOpen: !this.state.settingsIsOpen });
                this.generateDeck({
                  cardCount: this.state.cardCount,
                  theme: this.state.theme,
                  zoom: this.state.zoom
                });
              }}
            >
              Apply
            </button>
          </div>
          <div
            className="settingsButton"
            onClick={() => {
              this.setState({ settingsIsOpen: !this.state.settingsIsOpen });
            }}
          >
            <div className="logoBG">
              <img
                src="http://www.myiconfinder.com/uploads/iconsets/256-256-173468ecd27f5f440772862738d18473-gear.png"
                className="settingsIcon"
                alt="setting"
              />
            </div>
          </div>
        </div>
        <div className="cardsWrapper">
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
      </div>
    );
  }
}

export default App;
