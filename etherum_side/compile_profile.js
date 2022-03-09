import * as path from 'path';
import solc from 'solc';
import fs from 'fs-extra';



const __dirname = path.resolve();
const buildPath = path.resolve(__dirname, 'build_profile');
fs.removeSync(buildPath);

const campaignPath = path.resolve(__dirname, 'contracts', 'Submit_Profile.sol');
const source = fs.readFileSync(campaignPath, 'utf-8');


fs.ensureDirSync(buildPath);
const output = {

    language: "Solidity",
    sources: {
        "Submit_Profile.sol": {
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

const nft_bytecode = (compiled_abi.contracts['Submit_Profile.sol']['submit_profile'])

console.log(nft_bytecode.abi)
fs.outputJSONSync(
  path.resolve(buildPath, 'Submit_Profile' + '.json'),
  nft_bytecode
);