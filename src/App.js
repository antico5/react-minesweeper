import React, { Component } from 'react';
import {Minefield, MineTile} from './Minefield.js';
import logo from './logo.svg';
import normalSmile from './images/smile.png';
import deadSmile from './images/dead.png';
import winSmile from './images/win.png';
import './App.css';


class RevealedTile extends Component {
  renderSymbol = () => {
    var tile = this.props.tile
    if (tile.mined)
      return 'x'
    else if (tile.isClear())
      return ''
    else
      return tile.adjacentMines
  }

  render() {
    var tile = this.props.tile
    var classes = 'tile revealed'
    classes += ' count' + tile.adjacentMines
    if (tile.mined) classes += ' mined'

    return <div className={classes}>
      { this.renderSymbol() }
    </div>
  }
}

class UnrevealedTile extends Component {
  revealTile =() =>{
    if(this.props.tile.flagged || this.props.gameEnded) return
    this.props.tile.chainReveal()
  }

  flagTile = (e) => {
    if(!this.props.gameEnded)
      this.props.tile.toggleFlag()
    e.preventDefault()
  }

  render() {
    return <div className='tile' onClick={this.revealTile} onContextMenu={this.flagTile}>
      { this.props.tile.flagged ? 'F' : '' }
    </div>
  }
}

class Tile extends Component {
  render() {
    var tile = this.props.tile
    return tile.revealed ? <RevealedTile tile={tile}/> 
    : <UnrevealedTile tile={tile} gameEnded={this.props.gameEnded}/>
  }
}

class FaceControl extends Component {
  render() {
    var minefield = this.props.minefield
    var src
    if (minefield.isGameWon())
      src = winSmile
    else if (minefield.gameLost)
      src = deadSmile
    else
      src = normalSmile
    return <img className='face-control' src={src} onClick={this.props.onclick}/>
  }
}

class App extends Component {
  componentWillMount(){
    this.restartGame()
  }

  reRender = ()=>{
    this.forceUpdate()
  }

  preventDefault = (e) => {
    e.preventDefault()
  }

  restartGame = () => {
    var minefield = new Minefield({onUpdate: this.reRender })
    this.setState({ minefield: minefield })
  }

  isGameEnded = () => {
    return this.state.minefield.gameLost || this.state.minefield.isGameWon()
  }

  render() {
    var minefield = this.state.minefield
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Minesweeper</h1>
        </header> 
        <FaceControl minefield={minefield} onclick={this.restartGame}/>
        <div className='tile-container' onContextMenu={this.preventDefault} >
          { minefield.tiles.map( row => (
            <div className='tile-row'>
              { row.map( tile => (
                <Tile tile={tile} gameEnded={this.isGameEnded()} />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default App;
