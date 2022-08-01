import url from '../fetch'
import { get_access_token } from '../access_token'



export const update_description = async(description, address)=> {

    const response = await fetch(`${url}space/${address.toLowerCase()}`, {method: "PATCH", headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer${get_access_token()}`
    }, body: JSON.stringify({description}) })

    const response_to_json = await response.json()


    return response_to_json

}


export const update_banner = async(file,address) => {
    const response = await fetch(`${url}space/${address.toLowerCase()}/banner`, {method: "POST", headers: {
        'Authorization': `Bearer${get_access_token()}`
    }, body: file})
    return await response.json()
}
export const fetch_all_spaces = async() => {
    const response = await fetch(`${url}space/data/all`, {method: "GET"})

    return await response.json()
}
export const fetch_description = async(address)=> {


    const response = await fetch(`${url}space/data/${address.toLowerCase()}`, {method: "GET"})

    const response_json = await response.json()

    return response_json.description
}

export const create_new_space = async()=> {
    const response = await fetch(`${url}space/new`, {method: "POST", headers: { 
        'Authorization': `Bearer${get_access_token()}`
    }})
    return await response.json()
}