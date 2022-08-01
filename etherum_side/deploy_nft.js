import Web3 from "web3";
import HDWalletProvider  from '@truffle/hdwallet-provider'
import fs from 'fs'
import path from 'path';

const __dirname = path.resolve();

const buildPath = path.resolve(__dirname, 'addresses');

const compiledNFT_contract = JSON.parse(fs.readFileSync('./build_nft/Plateau_NFT.json'));


const initial_uri = "https://bafkreia647lqz54o6i43npes35kp3mvgcg6jkee3x2333ru3pz2gp3uoci.ipfs.nftstorage.link/"




const provider = new HDWalletProvider (
    '',  // here you need to add your mnemonic phrase
'https://black-bold-water.matic-testnet.discover.quiknode.pro/64ec46db114c87d96ef15bca97f4cd673fc74efd/'

); 

const web3 = new Web3(provider);


const deploy = async ()=> {

const accounts = await web3.eth.getAccounts();

console.log('Attempting to deploy from account', accounts[0]);


const result = await new web3.eth.Contract(compiledNFT_contract.abi)
.deploy({data: compiledNFT_contract.evm.bytecode.object,  arguments: [initial_uri]})
.send({gas: '5000000', from: accounts[0]});


console.log('Contract deployed to', result.options.address);

fs.outputJSONSync(
    path.resolve(buildPath, 'nft_address' + '.json'),
    {address: result.options.address}
  );
}

deploy();


