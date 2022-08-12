import React, { Component } from 'react';

import Card from '../Card/Card';

class GameTable extends Component {
    _botNumber = 3

    _mounted = false

    _colors = ["yellow", "green", "blue", "red"]

    _cardGroupes = {
        colode: [],
        player: [],
        bots: [],
        played: []
    }

    _colodePos = {
        x: 55, 
        y: 40
    }

    state = {

    }

    _createCard = (color, cardName, size, posX, posY, face, addIndx = '', rot = 0, z = 1)=>{
        this.setState({
            [color[0] + (cardName[0] ?? cardName) + addIndx]: {
                color,
                cardName, 
                size, 
                posX,
                posY, 
                face,
                id: color[0] + (cardName[0] ?? cardName) + addIndx, 
                rot,
                z
            }
        })
        this._cardGroupes.colode.push(color[0] + (cardName[0] ?? cardName) + addIndx)
    }

    _createCards(){
        let {_colors, _colodePos, _createCard} = this
        for(let color in _colors){
            for( let i = 0; i<10; i++){
                _createCard(_colors[color], i, 150, _colodePos.x, _colodePos.y, false)
            }
            _createCard(_colors[color], "picker", 150, _colodePos.x, _colodePos.y, false)
            _createCard(_colors[color], "reverse", 150, _colodePos.x, _colodePos.y, false)
            _createCard(_colors[color], "skip", 150, _colodePos.x, _colodePos.y, false)
        }
        for(let i = 0; i< 4; i++){
            _createCard("wild", "colora_changer", 150, _colodePos.x, _colodePos.y, false, i)
            _createCard("wild", "pick_four", 150, _colodePos.x, _colodePos.y, false, i)
        }   
    }

    _generateColode(){
        this._createCards()
        this._mixColode()
    }

    _mixColode(){
        let colodeCopy = [...this._cardGroupes.colode]
        let newColode = []

        while (colodeCopy.length>0){
            newColode.push(colodeCopy.splice(Math.floor(Math.random()*colodeCopy.length), 1)[0]) 
        }

        this._cardGroupes.colode = newColode
    }

    _dealCards(){
        let {_cardGroupes: {colode}, _botNumber} = this
        this._cardGroupes.player = colode.splice(0, 6)
        for(let i = 0; i<_botNumber;i++){
            this._cardGroupes.bots[i] = colode.splice(0, 6)
        }

        let {_cardGroupes: {player, bots}, _flipCard, _locateCard} = this
        let i = 0
        let y = 0 - player.length / 2
        for(let card in player){
            _flipCard(player[card], true)
            _locateCard(player[card], 200/player.length^3*40, 10+(i*70 /player.length), 70+Math.abs(y*y/5.25), 3*y, i)
            y++
            i++
        }
    }

    _locateCard = (id, size, posX, posY, rot, z)=>{
        this.setState(
            (state)=>{
                let card = {...state[id]}
                card.size = (size ?? card[size])
                card.posX = (posX ?? card[posX])
                card.posY = (posY ?? card[posY])
                card.rot = (rot ?? card[rot])
                card.z = (z ?? card[z])
                return {
                    [id]: card
                }
            }
        )
    }

    _flipCard = (id, facing) =>{
        this.setState(
            (state)=>{
                let card = {...state[id]}
                card.face = (facing ?? !state[id])
                return {
                    [id]: card
                }
            }
        )
    }
    
    componentDidMount(){
        if (!this._mounted){
            this._generateColode()
            this._dealCards()
        }
        this._mounted = true
    }

    render() {
        let cards = this.state

        return (
            <div id='game'>
                {
                    Object.values(cards).map((element)=>{return <Card key = {element.id} {...element}/>})
                }
            </div>
        );
    
        
    }
}

export default GameTable;
