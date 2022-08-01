const { get_access_token } = require("../access_token")
const url = require('../fetch')

export const sale_fetch = async(sell)=> {

    const response = await fetch(`${url}asset/sale`, {method: "POST", 
    headers: {
        'Authorization': `Bearer${get_access_token()}`,
        'Content-Type': 'application/json'}, body: JSON.stringify({sell})})

    const response_json = await response.json()
    return response_json
}


