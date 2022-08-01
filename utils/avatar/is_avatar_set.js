import url from '../fetch'

export const is_avatar_set = async(address)=> {


    const response = await fetch(url + `users/${address}/avatar`, {method: "GET"})

    return response.ok
}