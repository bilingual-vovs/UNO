import React, { Component } from 'react';

import errorImg from "./card-asset/card_back_alt_large.png"
import back from "./card-asset/card_back_large.png"
import "./Card.css"

class Card extends Component {
    render() {
        let image = errorImg
        let {color, cardName, face, size, posX, posY, rot, z} = this.props
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
            top: posY + "vh",
            left: posX + "vw",
            transform: `rotate(${rot}deg)`,
            zIndex: z
        }


        if(face){
            return (
                <img style={style} className='cards' src={image} alt={alt} />
            );
        }
        else{
            return (
                <img style={style} className='cards' src={back} alt={"back"} />
            );
        }
        
        
    }
}

export default Card;
