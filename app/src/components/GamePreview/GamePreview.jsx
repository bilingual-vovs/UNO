import React, { Component } from 'react';

import Card from '../Card/Card';
import "./GamePreview.css"

class GamePreview extends Component {
    mounted = false

    state = {
        cards: {}
    }

    _createCard = (color, cardName, size, posX, posY, face, addIndx = '', rot = 0, z = 1)=>{
        this.setState(({cards})=>{
            return {
               cards:  {
                ...cards,
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
            }
            } 
            
        })

    }

    componentDidMount(){
        let i = 0
        if (!this.mounted){
            setInterval(()=>{
                i++
                this._createCard(["red", "blue", "yellow", "green"][Math.floor(Math.random()*3)], 
                [1, 2, 3, 4, 5, 6, 7, 8, 9, "picker", "skip", 'reverse'][Math.floor(Math.random()*11)],
                150,
                Math.floor(Math.random()*100),
                Math.floor(Math.random()*100),
                Math.floor(Math.random()*2),
                i,
                Math.floor(Math.random()*360),
                i)
                this.setState(
                    ({cards})=>{
                        if (Object.values(cards).length > 150){
                            let res = {...cards}
                            delete res[Object.keys(res)[0]]
                            return {
                                cards: res
                            }
                        }
                    }
                )
            }, 800)
            this.mounted = true
        }
        
        
    }

    render() {
        let {cards} = this.state
        return (
            <React.Fragment>
                <button onClick={this.props.start} className='start'>Start Game</button>
                <div id='preview'>
                    {
                        Object.values(cards).map((element)=>{return <Card isPlayers={()=>{}} key = {element.id} {...element}/>})
                    }
                </div>
            </React.Fragment>
            
        );
    }
}

export default GamePreview;
