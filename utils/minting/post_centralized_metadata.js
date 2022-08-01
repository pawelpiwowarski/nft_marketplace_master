import url from '../fetch'
import { get_access_token } from '../access_token'
export const post_centralized_metadata = async({name,description,token_id}, data)=> {

    
    
    const response = await fetch(`${url}asset/new?name=${name}&description=${description}&token_id=${token_id}`, {method: "POST", 
    headers: {
        'Authorization': `Bearer${get_access_token()}`,
    }, body: data})

    const response_to_json = await response.json()
    return response_to_json
}


export const fetch_metadata_for_specific_token = async(id)=> {

    const response = await fetch(`${url}asset/data/${id}`, {method: "GET", headers: {
        'Content-Type': 'application/json',
    }})

    return await response.json()
}
export const fetch_all_tokens_created_by_a_user = async (address)=> {


    const response = await fetch(`${url}assets/data/${address.toLowerCase()}`, {method: "GET", headers: {
        'Content-Type': 'application/json',
    }})

    return await response.json()
}