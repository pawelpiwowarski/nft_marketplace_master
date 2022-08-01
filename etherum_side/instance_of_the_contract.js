import web3 from './web3';
import compiledNFT_contract from './build_nft/Plateau_NFT.json'
import { NFT } from './addresses';
const instance = new web3.eth.Contract(
    compiledNFT_contract.abi,
    NFT
)


export default instance;