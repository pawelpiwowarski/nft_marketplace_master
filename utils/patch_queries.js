import { get_access_token } from './access_token'
import url from './fetch'

export const patch = async(address, patch)=> {


    const response = await fetch(`${url}users/${address}`, {method: "PATCH", 
    headers: {
        'Authorization': `Bearer${get_access_token()}`,
        'Content-Type': 'application/json'}, body: JSON.stringify(patch)})

    const response_json = await response.json()
    return response_json
}