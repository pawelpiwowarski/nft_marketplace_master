import Web3 from "web3";
import HDWalletProvider  from '@truffle/hdwallet-provider'
import fs from 'fs'

const compiledNFT_contract = JSON.parse(fs.readFileSync('./build/High_NFT.json'));

console.log(provider)

