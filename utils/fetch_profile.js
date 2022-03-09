import url from './fetch'
import { utils } from "ethers";

const fetch_profile_details = async(address)=> {
    let res_to_json
    try {
        const res = await fetch( url + 'get_profile_details?address=' +  utils.getAddress(address), {method: 'GET', headers: {'Content-Type': 'application/json'}} )

       res_to_json = await res.json()
       
      }
      catch(e) {
        res_to_json = e
      }
return res_to_json
}

module.exports = fetch_profile_details
