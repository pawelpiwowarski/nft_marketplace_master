import web3 from './web3';
import compiledNFT_contract from './build/High_NFT.json'

const instance = new web3.eth.Contract(
    compiledNFT_contract.abi,
    '0x837a8ca559c78293485C145aEE2e4e939f40eF46'
)


export default instance;