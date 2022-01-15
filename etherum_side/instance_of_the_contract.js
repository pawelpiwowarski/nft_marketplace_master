import web3 from './web3';
import compiledNFT_contract from './build/High_NFT.json'

const instance = new web3.eth.Contract(
    compiledNFT_contract.abi,
    '0xf8a8d07B9683aE1cAFEA90C752344ADCA655A083'
)


export default instance;