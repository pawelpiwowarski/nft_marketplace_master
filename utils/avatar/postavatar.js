import url from '../fetch'
import { get_access_token } from '../access_token'
export const post_avatar = async(data)=> {





    try {
    
        const response = await fetch(url + 'users/me/avatar', {method: "POST", headers: {
            'Authorization':`Bearer${get_access_token()}`
        },body: data})
        const response_json = await response.json()
        console.log(response_json)
    }

    catch(e) {
        console.log(e)
    }
}