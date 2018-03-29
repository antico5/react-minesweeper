import React, { Component } from 'react';
import {Minefield, MineTile} from './Minefield.js';
import logo from './logo.svg';
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
    this.props.tile.chainReveal()
    this.props.onClicked()
  }

  flagTile = (e) => {
    this.props.tile.toggleFlag()
    this.props.onClicked()
    e.preventDefault()
    return false
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
    return tile.revealed ? <RevealedTile tile={tile}/> : <UnrevealedTile tile={tile} onClicked={this.props.reRender}/>
  }
}

window.minefield = new Minefield()

class App extends Component {
  componentWillMount(){
    this.setState({ tiles: window.minefield.tiles })
  }

  reRender = ()=>{
    this.forceUpdate()
  }

  renderTiles(){
    const tiles = []

    for(let row of this.state.tiles){
      for(let tile of row){
        tiles.push(
          <Tile key={tiles.length} tile={tile} reRender={this.reRender} />
        )
      }
    }
    return tiles
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Minesweeper</h1>
        </header>
      <div className='tile-container'>
        { /* this.renderTiles() */ }
        { this.state.tiles.map( row => (
          <div style={{display: 'table-row'}}>
            { row.map( tile => (
              <Tile tile={tile} reRender={this.reRender} />
            ))}
          </div>
        ))}
      </div>
      </div>
    );
  }
}

export default App;
