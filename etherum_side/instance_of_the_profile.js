import web3 from './web3';
import compiledNFT_contract from './/build_profile/Submit_Profile.json'
import {PROFILE} from './addresses'

const instance = new web3.eth.Contract(
    compiledNFT_contract.abi,
    PROFILE
)


export default instance;