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


class App extends Component {
  componentWillMount(){
    var minefield = new Minefield({onUpdate: this.reRender })
    this.setState({ minefield: minefield })
  }

  reRender = ()=>{
    this.forceUpdate()
    console.log('updating');
    
  }

  preventDefault = (e) => {
    e.preventDefault()
  }

  render() {
    var minefield = this.state.minefield
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Minesweeper</h1>
        </header>
        <div className='tile-container' onContextMenu={this.preventDefault} >
          { minefield.tiles.map( row => (
            <div style={{display: 'table-row'}}>
              { row.map( tile => (
                <Tile tile={tile} gameEnded={minefield.gameEnded} />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default App;
