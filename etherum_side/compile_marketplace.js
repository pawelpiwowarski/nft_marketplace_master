import * as path from 'path';
import solc from 'solc';
import fs from 'fs-extra';



const __dirname = path.resolve();
const buildPath = path.resolve(__dirname, 'build_marketplace');
fs.removeSync(buildPath);

const campaignPath = path.resolve(__dirname, 'contracts', 'Plateau_marketplace.sol');
const source = fs.readFileSync(campaignPath, 'utf-8');


fs.ensureDirSync(buildPath);
const output = {

    language: "Solidity",
    sources: {
        "Plateau_marketplace.sol": {
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

const nft_bytecode = (compiled_abi.contracts['Plateau_marketplace.sol']['plateau_marketplace'])


fs.outputJSONSync(
  path.resolve(buildPath, 'Plateau_Marketplace' + '.json'),
  nft_bytecode
);