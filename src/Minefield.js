const columns = 20
const rows = 20

class Minefield {
  constructor(){
    this.tiles = this.generateMineField()
    this.calculateAdjacentMines()
  }

  getTile(x, y){
    if(x >= 0 && x < columns && y >= 0 && y < rows){
      return this.tiles[x][y]
    }
  }

  generateMineField(){
    var tiles = []
    for (var i = 0; i < rows; i++) {
      tiles[i] = []
      for( var j = 0; j < columns; j++) {
        var mined = Math.random() > 0.8
        tiles[i].push(new MineTile(this,i,j))
      }
    }
    return tiles
  }

  calculateAdjacentMines(){
    for (var i = 0; i < rows; i++) {
      for( var j = 0; j < columns; j++) {
        var tile = this.getTile(j,i)
        if(tile.mined){
          tile.getAllNeighbors().forEach(tile => tile.increaseAdjacentMines())
        }
      }
    }
  }
}

class MineTile {
  constructor(minefield, row, column){
    this.minefield = minefield
    this.row = row
    this.column = column
    this.mined = Math.random() > 0.9
    this.revealed = false
    this.flagged = false
    this.adjacentMines = 0
  }

  reveal(){
    this.revealed = true
  }

  toggleFlag(){
    this.flagged = !this.flagged
  }

  chainReveal(){
    if (this.revealed) return
    this.reveal()
    if(this.isClear())
      this.getCrossNeighbors().forEach(tile => tile.chainReveal())
  }


  getNeighbors(offsets){
    var neighbors = []
    offsets.forEach(offset => {
      var neighbor = this.minefield.getTile(this.row + offset[0], this.column + offset[1])
      neighbor && neighbors.push(neighbor)
    })
    return neighbors
  }

  getAllNeighbors(){
    const offsets = [[-1,-1],[0,-1],[1,-1],[-1,0],[1,0],[-1,1],[0,1],[1,1]]
    return this.getNeighbors(offsets)
  }

  getCrossNeighbors(){
    const offsets = [[0,-1],[-1,0],[1,0],[0,1]]
    return this.getNeighbors(offsets)
  }

  increaseAdjacentMines(){
    this.adjacentMines += 1
  }

  isClear(){
    return this.adjacentMines == 0
  }

}

export { Minefield, MineTile }
