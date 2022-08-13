import React, { Component } from 'react';

import errorImg from "./card-asset/card_back_alt_large.png"
import back from "./card-asset/card_back_large.png"
import "./Card.css"

class Card extends Component {

    isPlayers = this.props.isPlayers

    state = {
        add: 0,
        onTop: 0
    }

    _hover = () => {
        if(this.isPlayers(this.props.id)){
            this.setState({
                addY: -3,
                onTop: 1000
            })
        }
    }
    _unHover = () => {
        if(this.isPlayers(this.props.id)){
            this.setState({
                addY: 0,
                onTop: 0
            })
        }
    }

    render() {
        let image = errorImg
        let {props: {color, cardName, face, size, posX, posY, rot, z, id}, state: {addY, onTop}, _hover, _unHover} = this
        let alt = `${color}_${cardName}`
        try {
            image = require(`./card-asset/${color}_${cardName}_large.png`)
        } catch (error) {
            image = errorImg
            alt = `${color}_${cardName}, not found :(`
            console.error(`${color}_${cardName}, not found :(`)
        }

        let style = {
            width: size,
            top: posY + (addY ?? 0) + "vh",
            left: posX + "vw",
            transform: `rotate(${rot}deg)`,
            zIndex: Math.max(z, onTop)
        }

        if(face){
            return (
                <img onClick={()=>{this.props.playCard(); _unHover()}} onMouseOut={_unHover} onMouseOver={_hover} style={style} key={id} className='cards' src={image} alt={alt} />
            );
        }
        else{
            return (
                <img onClick={()=>{this.props.playCard(); _unHover()}} onMouseOut={_unHover} onMouseOver={_hover} style={style} key={id} className='cards' src={back} alt={"back"} />
            );
        }
        
        
    }
}

export default Card;
