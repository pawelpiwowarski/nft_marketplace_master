
import Web3 from "web3"
export const get_price_in_eur = async (price_wei)=> {

    try {

    const url = 'https://api.binance.com/api/v3/ticker/price?symbol=MATICEUR'
    const price_in_matic = Web3.utils.fromWei(price_wei, 'ether')

    const response = await fetch(url, {method: "GET"})

    const response__json = await response.json()

    const {price} = response__json



    return (price*price_in_matic).toPrecision(3)
    }

    catch({message}) {
        return message
    }
}

export const get_price_in_usd = async (price_wei)=> {

    try {
    const url = 'https://api.binance.com/api/v3/ticker/price?symbol=MATICUSDT'
    const price_in_matic = Web3.utils.fromWei(price_wei, 'ether')

    const response = await fetch(url, {method: "GET"})

    const response__json = await response.json()

    const {price} = response__json



    return (price*price_in_matic).toPrecision(3)

    }

    catch({message}) {
       return message
    }
}