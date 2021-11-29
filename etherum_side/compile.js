import * as path from 'path';
import solc from 'solc';
import fs from 'fs-extra';



const __dirname = path.resolve();
const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

const campaignPath = path.resolve(__dirname, 'contracts', 'High_Nft.sol');
const source = fs.readFileSync(campaignPath, 'utf-8');


fs.ensureDirSync(buildPath);
const output = {

    language: "Solidity",
    sources: {
        "High_Nft.sol": {
            content: source
        }
    },

    settings: {
    
    outputSelection: {
        '*': {
          '*': ['*']
        }
      }
}
}

const compiled_abi = JSON.parse(solc.compile(JSON.stringify(output)));

console.log(compiled_abi)

const nft_bytecode = (compiled_abi.contracts['High_Nft.sol']['High_NFT'])

console.log(nft_bytecode.abi)
fs.outputJSONSync(
  path.resolve(buildPath, 'High_NFT' + '.json'),
  nft_bytecode
);