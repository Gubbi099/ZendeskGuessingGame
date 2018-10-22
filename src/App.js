import React, { Component } from "react";
import "./App.css";
import Card from "./Card.js";
import _ from "lodash";
class App extends Component {
  constructor(props) {
    super(props);

    const cards = [
      {
        id: 1,
        flipped: false,
        imgUrl:
          "https://4awcmd1th3m1scfs83pxlvbh-wpengine.netdna-ssl.com/wp-content/uploads/2017/10/seedless-watermelon.jpg"
      },
      {
        id: 2,
        flipped: false,
        imgUrl:
          "https://preview.redd.it/de21lu265zk01.png?width=454&auto=webp&s=d7859a02c4b84bca2647f11cc6fe2c5000e8d76f"
      },
      {
        id: 3,
        flipped: false,
        imgUrl: "https://media.giphy.com/media/zK3R40EPmQk9y/source.gif"
      },
      {
        id: 4,
        flipped: false,
        imgUrl:
          "http://en.bcdn.biz/images/emails_source/3a890069-edfb-4ceb-ab29-9a1b6fb206cf.jpg"
      },
      {
        id: 5,
        flipped: false,
        imgUrl:
          "https://animals.sandiegozoo.org/sites/default/files/2016-08/category-thumbnail-mammals_0.jpg"
      }
    ];
    const allcards = [...cards, ...cards].map((card, index) => {
      return { ...card, uniqueId: index };
    });

    this.state = {
      cards: _.shuffle(allcards)
    };
  }
  onCardClicked(id) {
    this.setState({
      cards: this.state.cards.map(card => {
        if (card.uniqueId === id) {
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
              key={card.uniqueId}
              onClick={() => {
                this.onCardClicked(card.uniqueId);
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
