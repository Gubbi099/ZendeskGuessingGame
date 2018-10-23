import React, { Component } from "react";
import "./App.css";
import Card from "./Card.js";
import _ from "lodash";

class App extends Component {
  constructor(props) {
    super(props);

    const cards = [
      {
        pairid: 1,
        flipped: false,
        imgUrl:
          "https://4awcmd1th3m1scfs83pxlvbh-wpengine.netdna-ssl.com/wp-content/uploads/2017/10/seedless-watermelon.jpg"
      },
      {
        pairid: 2,
        flipped: false,
        imgUrl:
          "https://preview.redd.it/de21lu265zk01.png?width=454&auto=webp&s=d7859a02c4b84bca2647f11cc6fe2c5000e8d76f"
      },
      {
        pairid: 3,
        flipped: false,
        imgUrl: "https://media.giphy.com/media/zK3R40EPmQk9y/source.gif"
      },
      {
        pairid: 4,
        flipped: false,
        imgUrl:
          "http://en.bcdn.biz/images/emails_source/3a890069-edfb-4ceb-ab29-9a1b6fb206cf.jpg"
      },
      {
        pairid: 5,
        flipped: false,
        imgUrl:
          "https://animals.sandiegozoo.org/sites/default/files/2016-08/category-thumbnail-mammals_0.jpg"
      }
    ];
    const allcards = [...cards, ...cards].map((card, index) => {
      return { ...card, uniqueId: index };
    });

    console.log(allcards);

    this.state = {
      cards: _.shuffle(allcards),
      currentSelectedCard: undefined
    };
  }

  reset = () => {
    this.setState({
      isResetting: true
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
      }, 100);
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
    console.log(this.state.isResetting);
    if (clickedCard.flipped || this.state.isResetting) {
      return;
    }

    const { currentSelectedCard } = this.state;

    await this.updateCard(clickedCard.uniqueId, { flipped: true });

    if (currentSelectedCard !== undefined) {
      if (currentSelectedCard.pairid === clickedCard.pairid) {
        await this.updateCard(currentSelectedCard.uniqueId, {
          found: true,
          flipped: true
        });
        await this.updateCard(clickedCard.uniqueId, {
          found: true,
          flipped: true
        });
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
    );
  }
}

export default App;
