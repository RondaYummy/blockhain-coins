//import that secure hash algorithm from the crypto-js package
const SHA256 = require('crypto-js/sha256');

//create a JavaScript class to represent a Block
class Block {
  constructor(index, timestamp, data, previousHash) {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.nonce = 0; // Add nonce variable
    this.hash = this.generateHash();
  }

  generateHash() {
    let hash = SHA256(
      this.index +
      this.timestamp +
      this.previousHash +
      JSON.stringify(this.data) +
      this.nonce, // Add nonce value to hash
    ).toString();

    while (!hash.startsWith('0000')) { // Adjust difficulty level as needed ( 0000 )
      this.nonce++; // Increment nonce value until hash meets difficulty level
      hash = SHA256(
        this.index +
        this.timestamp +
        this.previousHash +
        JSON.stringify(this.data) +
        this.nonce,
      ).toString();
    }
    return hash;
  }
}

class Blockchain {
  constructor() {
    this.blockchain = [ this.createGenesisBlock() ];
  }

  createGenesisBlock() {
    return new Block(0, Date.now(), 'First block on the chain', '0');
  }

  getTheLatestBlock() {
    return this.blockchain[this.blockchain.length - 1];
  }

  addNewBlock(newBlock) {
    newBlock.previousHash = this.getTheLatestBlock().hash;
    newBlock.hash = newBlock.generateHash();
    this.blockchain.push(newBlock);
  }

  // testing the integrity of the chain
  validateChainIntegrity() {
    for (let i = 1; i < this.blockchain.length; i++) {
      const currentBlock = this.blockchain[i];
      const previousBlock = this.blockchain[i - 1];
      if (currentBlock.hash !== currentBlock.generateHash()) {
        return false;
      }
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
      return true;
    }
  }
}

let synergyCoin = new Blockchain();
console.log('Mining synergyCoin in progress...');

for (let i = 0; i <= 99; i++) {
  synergyCoin.addNewBlock(new Block(i, Date.now(), {
    sender: 'Elena',
    recipient: 'Mary',
    quantity: Math.floor(Math.random() * (1000 - 1) + 1),
  }));
}

console.log(synergyCoin.blockchain,
  `synergyCoin: ${ synergyCoin.validateChainIntegrity() }. Count: ${ synergyCoin.blockchain.length }`);
