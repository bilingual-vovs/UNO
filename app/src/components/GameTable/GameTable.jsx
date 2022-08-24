import React, { Component } from 'react';

import Card from '../Card/Card';
import Alert from '../Alert/Alert';

class GameTable extends Component {
    winners = []

    _lastZIndex = 100
    _botNumber = 3

    direction = true
    nowMoving = 0

    _mounted = false

    _colors = ["yellow", "green", "blue", "red"]

    _cardGroupes = {
        colode: [],
        player: [],
        bots: [],
        played: [],
        active: [],
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
    _newActive = []
    _stopAction = 0
    players = [this._cardGroupes.player]

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

    _normalizeColode = () => {
        let {_cardGroupes: {colode, active}, _locateCard, _colodePos: {x, y}, _flipCard, _playCard} = this
        let i = colode.length +1
        for (let card in colode){
            i--
            _locateCard(colode[card], 150, x+i*0.01, y+i*-0.1, false, i)
            _flipCard(colode[card], false)
        }
        _playCard(active[active.length-1])
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
        let {_cardGroupes: {colode}, _botNumber, _playCard: playCard, _flipCard, _changeActive: changeActive} = this
        this._cardGroupes.player = colode.splice(colode.length-7, 6)
        for(let i = 0; i<_botNumber;i++){
            this._cardGroupes.bots[i] = colode.splice(colode.length-7, 6)
        }

       this._updateCardPosition()
       _flipCard(colode[colode.length-1], true)
        playCard(colode[colode.length-1])
        changeActive()
    }

    _locateCard = (id, size, posX, posY, rot, z, face)=>{
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
        this._flipCard(id, true)
        this._locateCard(id, 150, 35, 35, 0, this._lastZIndex)
        this._updateCardPosition()
        this._newActive.push(id)
        if (id[1] === 's') this._stopAction++
        if (id[1] === "r") this.direction = !this.direction
    }

    _changeActive = () => {
        this._cardGroupes.active = this._newActive
        this._newActive = []
    }
    

    takeCard = () => {
        let player = this.nowMoving
        let card = this._cardGroupes.colode.shift()
        if (player === 0){
            this._flipCard(card, true)
            this._cardGroupes.player.push(card)
        }
        else{
            this._flipCard(card, false)
            this._cardGroupes.bots[player-1].push(card)
        }

        if (this._cardGroupes.colode.length < 5){
            this._cardGroupes.colode = this._cardGroupes.played
            this._mixColode()
            this._cardGroupes.played = []
            this._normalizeColode()
        }

        this._updateCardPosition()
    }

    playerPlayCard = (card) => {
        let {isPLayers, _cardGroupes: {active, player}, nowMoving, props: {cardAlert}, nextMove, takeCard} = this
        let activeCard = active[active.length-1]

        let posibility = player.find((elm)=>elm[0] === active[0] || elm[1] === active[1] || elm[0] === 'w'  || active[0] === 'w' )

        if(isPLayers(card) && nowMoving === 0 && (card[0] === activeCard[0] || card[1] === activeCard[1] || card[0] === "w" || activeCard[0] === "w" || this._newActive[this._newActive.length - 1][0] === "w")){
            this._playCard(card)
            if (card[0] !== "w" && card[1] !== "r"){
                this._changeActive()
                nextMove()
            } else if (!posibility) {
                takeCard()
                nextMove()
            }
        }
        else {
            cardAlert()
        }
        
        
    }

    botMove = () => {
        let id = this.nowMoving-1
        let {_cardGroupes: {bots, active: activeArr}, _playCard: playCard, takeCard, _stopAction} = this
        let bot = bots[id]
        let active = activeArr[activeArr.length-1]
        let movementFinished, oneCardHasBeenTaken = false

        let cardsToTake = 0
        activeArr.forEach((elm)=>{
            if (elm.slice(0, 2) === "wp"){
                cardsToTake += 4
            }
            else if (elm[1] === "p"){
                cardsToTake += 2
            }
        })
        
        for(let i = 0; i<cardsToTake;i++){
            takeCard()
        }

        if (_stopAction > 0){
            this._cardGroupes.active = [this._cardGroupes.active[this._cardGroupes.active.length - 1]]
            this._stopAction -= 1
            this.nextMove()
        }else{
        let a = setInterval(()=>{
            
            let card = bot.find((elm)=>elm[0] === active[0] || elm[1] === active[1] || active[0] === 'w' )
            setTimeout(()=>{})
            if  (card){
                playCard(card)
                if ((card[0] !== "w" && card[1] !== "r")){
                    movementFinished = true
                }
            }
            else{
                takeCard()
                oneCardHasBeenTaken = true
            }
            if((oneCardHasBeenTaken || movementFinished)){
                clearInterval(a)
                if (movementFinished)   this._changeActive()
                this.nextMove()
            }
        }, 600)
        }

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

    playerMove = () => {
        let {_cardGroupes: {active: activeArr, player}, takeCard, nextMove, _stopAction} = this
        let active = activeArr[activeArr.length-1]


        let cardsToTake = 0
        activeArr.forEach((elm)=>{
            if (elm.slice(0, 2) === "wp"){
                cardsToTake += 4
            }
            else if (elm[1] === "p"){
                cardsToTake += 2
            }
        })

        let posibility = player.find((elm)=>elm[0] === active[0] || elm[1] === active[1] || elm[0] === 'w'  || active[0] === 'w' )
        
        for(let i = 0; i<cardsToTake;i++){
            takeCard()
        }
        if (_stopAction> 0) {
            _stopAction-- 
            this._cardGroupes.active = [this._cardGroupes.active[this._cardGroupes.active.length - 1]]
            nextMove()
        }
        else if (! posibility){
            takeCard()
            this._cardGroupes.active = [this._cardGroupes.active[this._cardGroupes.active.length - 1]]
            nextMove()
        }


    }

    nextMove = () => {
        this.isWinner()

        if (this.direction){
            switch (this.nowMoving) {
                case this._botNumber:
                    this.nowMoving = 0
                break;
                default:
                    this.nowMoving++
                break;
            }
        }
        else{
            switch (this.nowMoving) {
                case 0:
                    this.nowMoving = 3
                break;
                default:
                    this.nowMoving--
                break;
            }
        }
        if (this.nowMoving !== 0){
            setTimeout(()=>{
                this.botMove()
            }, 700)
            
        }
        else{
            this.playerMove()
        }
    }

    isWinner = () => {
        let {_cardGroupes: {player, bots}, nowMoving: id} = this

        if (id === 0) {
            if (player.length === 0) this.winners.push(id)
        }
        else if (bots[id-1].length === 0){
            this.winners.push(id)
        }
    }

    _startGame = () => {
        
    }
    
    componentDidMount(){
        if (!this._mounted){
            this._generateColode()
            this._dealCards()
            this.playerMove()
            this._normalizeColode()
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
