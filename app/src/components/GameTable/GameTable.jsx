import React, { Component } from 'react';

import Card from '../Card/Card';
import Alert from '../Alert/Alert';

class GameTable extends Component {
    _lastZIndex = 100
    _botNumber = 3

    _mounted = false

    _colors = ["yellow", "green", "blue", "red"]

    _cardGroupes = {
        colode: [],
        player: [],
        bots: [],
        played: [],
        move: (id, to) =>{
            let {colode, bots, player} = this._cardGroupes
            for(let botKey in bots){
                let bot = bots[botKey]
                for (let cardKey in bot){
                    let card = bot[cardKey]
                    if (card === id) {
                        let card = this._cardGroupes.bots[botKey][cardKey]
                        this._cardGroupes[to].push(card)
                        this._cardGroupes.bots[botKey].splice(this._cardGroupes.bots[botKey].indexOf(card), 1)
                    }
                }
            }
            
            for (let cardKey in colode){
                let card = colode[cardKey]
                if (card === id) {
                    let card = this._cardGroupes.colode[cardKey]
                    this._cardGroupes[to].push(card)
                    this._cardGroupes.colode.splice(this._cardGroupes.colode.indexOf(card), 1)
                }
            }

            for (let cardKey in player){
                let card = player[cardKey]
                if (card === id) {
                    let card = this._cardGroupes.player[cardKey]
                    this._cardGroupes[to].push(card)
                    this._cardGroupes.player.splice(this._cardGroupes.player.indexOf(card), 1)
                }
            }
        }
    }

    _colodePos = {
        x: 55, 
        y: 35
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
        let cardNum = 0
        for(let color in _colors){
            for( let i = 0; i<10; i++){
                cardNum++
                _createCard(_colors[color], i, 150, _colodePos.x+cardNum*0.01, _colodePos.y+cardNum*-0.1, false)
            }
            cardNum++
            _createCard(_colors[color], "picker", 150, _colodePos.x+cardNum*0.01, _colodePos.y+cardNum*-0.1, false)
            cardNum++
            _createCard(_colors[color], "reverse", 150, _colodePos.x+cardNum*0.01, _colodePos.y+cardNum*-0.1, false)
            cardNum++
            _createCard(_colors[color], "skip", 150, _colodePos.x+cardNum*0.01, _colodePos.y+cardNum*-0.1, false)
        }
        for(let i = 0; i< 4; i++){
            cardNum++
            _createCard("wild", "colora_changer", 150, _colodePos.x+cardNum*0.01, _colodePos.y+cardNum*-0.1, false, i)
            cardNum++
            _createCard("wild", "pick_four", 150, _colodePos.x+cardNum*0.01, _colodePos.y+cardNum*-0.1, false, i)
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
        let {_cardGroupes: {colode}, _botNumber, _playCard: playCard, _flipCard} = this
        this._cardGroupes.player = colode.splice(colode.length-7, 6)
        for(let i = 0; i<_botNumber;i++){
            this._cardGroupes.bots[i] = colode.splice(colode.length-7, 6)
        }

       this._updateCardPosition()
       _flipCard(colode[colode.length-1], true)
        playCard(colode[colode.length-1])
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
                card.face = (facing ?? !card.face)
                return {
                    [id]: card
                }
            }
        )
    }

    _updateCardPosition = () => {
        let {_cardGroupes: {player, bots}, _flipCard, _locateCard} = this
        let i = 0
        let y = 0 - player.length / 2
        for(let card in player){
            _flipCard(player[card], true)
            _locateCard(player[card], 200, 10+70 /player.length/2+(i*70 /player.length), 70+Math.abs(y*y/5.25)/player.length*10, 3*y, i)
            y++
            i++
        }
        

        let botCount = 1
        for(let bot in bots){
            let botCrd = bots[bot]
            i = 0
            y = 0 - botCrd.length / 2
            for(let card in botCrd){
                switch (botCount) {
                    case 1:
                        _locateCard(botCrd[card], 120, 0-Math.abs(y*y/10),10+50 /botCrd.length/2+(i*50 /botCrd.length), 90*botCount+3*y, i)
                    break;
                    case 2:
                        _locateCard(botCrd[card], 120, 20+50 /botCrd.length/2+(i*50 /botCrd.length), 0-Math.abs(y*y/5.25), 180-3*y, i)
                    break;
                    case 3:
                        _locateCard(botCrd[card], 120, 93+Math.abs(y*y/10),10+50 /botCrd.length/2+(i*50 /botCrd.length), 90*botCount-3*y, i)
                    break;
                    default:

                    break;
                }
                y++
                i++
            }
            botCount++
        }
        

    }

    _playCard = (id) =>{
        this._cardGroupes.move(id, "played")
        this._lastZIndex += 1
        this._locateCard(id, 150, 35, 35, 0, this._lastZIndex)
    }

    playerPlayCard = (id) => {
        this.setState(
            state=>{
                let card = state[id]
                let activeCard = state[this._cardGroupes.played[this._cardGroupes.played.length-1]]
                if((card.color === activeCard.color || card.color === "wild" || activeCard.color === "wild" || card.cardName === activeCard.cardName) && this.isPLayers(id)){
                    this._playCard(id)
                    this._updateCardPosition()
                }
                else{
                    this.props.cardAlert()
                }
                                                                                                                                             
            }
        )
    }

    isPLayers = (id) => {
        let {player} = this._cardGroupes
        if(player.indexOf(id) !== -1){
            return true
        }
        else{
            return false
        }
    }

    _startGame = () => {
        
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
                    Object.values(cards).map((element)=>{return <Card playCard={()=>{this.playerPlayCard(element.id)}} isPlayers={this.isPLayers} key = {element.id} {...element}/>})
                }
            </div>
        );
    
        
    }
}

export default GameTable;
