import React, { Component } from 'react';

import Card from '../Card/Card';

class GameTable extends Component {
    _colors = ["yellow", "green", "blue", "red"]

    mixer = array => {
        for (let i = array.length; i; i--) {
            let randomized = Math.floor(Math.random() * i);
            [array[i - 1], array[randomized]] = [array[randomized], array[i - 1]];
        }
        return array;//here
    }

    state = {
        player: [],
        bots: [],
        colode: [],
        playedCards: [],
        gameDirection: true
    }

    _createCard(color, cardName, size, posX, posY, face){
        return {
            color, 
            cardName, 
            size,
            posX,
            posY,
            face,
            id: color[0] + cardName[0]
        }
    }

    _generateColode(){
        let colode = []
        let count = 0
        for(let color in this._colors){
            for(let i = 0; i<10; i++){
                colode.push(this._createCard(this._colors[color], i, 150, 55+count*0.2, 45+count, false))
                count -= 0.1
            }
            colode.push(this._createCard(this._colors[color], "picker", 150, 55+count*0.2, 45+count, false))
            count -= 0.1
            colode.push(this._createCard(this._colors[color], "reverse", 150, 55+count*0.2, 45+count, false))
            count -= 0.1
            colode.push(this._createCard(this._colors[color], "skip", 150, 55+count*0.2, 45+count, false))
            count -= 0.1
        }
        colode.push(this._createCard("wild", "colora_changer", 150, 55+count*0.2, 45+count, false))
        count -= 0.1
        colode.push(this._createCard("wild", "pick_four", 150, 55+count*0.2, 45+count, false))
        count -= 0.1
        return colode
    }

    _mixColode(){
        this.setState(
            ({colode}) =>{
                return this.mixer(colode)
                    .map((card, i)=>{
                        card.posX = 55 + i * 0.02
                        card.posY = 45 - i * 0.1
                        return card
                    })
            }
        )
    }


    _reFaceCard(id){
        this.setState(
            ({playedCards}) => {
                let newPlayedCards = [...playedCards]
                for(let card in newPlayedCards){
                    if(card.id == id){
                        newPlayedCards[card].face = !newPlayedCards[card].face 
                        return {
                            playedCards: newPlayedCards
                        }
                    }
                }
            }
        )
    }

    componentDidMount(){
        this.setState({colode: this._generateColode()})
        this._mixColode()
    }

    render() {
        let {colode} = this.state
        return (
            <div id='game'>
                {
                    colode.map((element)=>{return <Card key = {element.id} {...element}/>})
                }
            </div>
        );
    }
}

export default GameTable;
