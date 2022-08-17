
import url from '../fetch'
import { get_access_token } from '../access_token'

export const delete_account = async (address)=> {


    const response = await fetch(`${url}users/${address}`, {method: "DELETE", 
    headers: {
        'Authorization': `Bearer${get_access_token()}`,
        'Content-Type': 'application/json'}})

    const reponse_json = await response.json()

    return reponse_json
}
