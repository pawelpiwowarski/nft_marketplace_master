import url from './fetch'
import { does_user_exists } from './autheniticate';

const fetch_profile_details = async(address)=> {
    let res_to_json
    try {
   
        const res = await fetch( url + `users/` +  address.toLowerCase(), {method: 'GET'} )

       res_to_json = await res.json()
       
      }
      catch(e) {
        res_to_json = e
      }

if ((await does_user_exists(address))) {
      return res_to_json
}
else {
  return ''
}
}

module.exports = fetch_profile_details

