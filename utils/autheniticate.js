import { get_access_token,set_access_token  } from "../utils/access_token";
import url from './fetch'

const get_nonce = async(address)=> {
  const response = await fetch(`${url}users/generate_nonce`, { 
    method: "POST" , headers: {
      'Content-Type': 'application/json',
    },body: JSON.stringify({address})
  }
    )

  const response_to_json= await response.json()

  return response_to_json

}


 const personal_sign  = async(address)=> {


const request = await window.ethereum.request({
    method: 'personal_sign',
    params: [`Sign this message to login to the marketplace for 7 days!👽 Nonce: ${await get_nonce(address)}`, address]
})


   
const response = await fetch(`${url}users/authenticate/?signature=${request}`, {method: "POST",   
mode: 'cors',
redirect: 'follow',   
credentials: 'include',headers: {

 'Content-Type': 'application/json',
 'Accept': 'application/json'

},body: JSON.stringify({address})})

const response_to_json = await response.json()

console.log(response_to_json)



return response_to_json

}

export const create_user = async(address, username, email)=> {
  const request = await window.ethereum.request({
    method: 'personal_sign',
    params: [`Sign this message to approve that you are the owner of the account: ! ${username}`, address]
})

const response = await fetch(`${url}users/create/?signature=${request}`, {method: "POST", headers: {
  'Content-Type': 'application/json'
},body: JSON.stringify({username, address, email}), credentials: 'include' })

return (await response.json())


}
const get_access_token_from_refresh = async()=> {


  const response = await fetch(`${url}refresh_token`, {method:"POST",credentials: 'include'})

  const response_to_json = await response.json()

  return response_to_json
} 

export const does_user_exists = async(address_big)=> {

  try {
 const address = address_big.toLowerCase()
  const response = await fetch(`${url}users/generate_nonce`, {method: "POST", headers: {
    'Content-Type': 'application/json'
  },body: JSON.stringify({address})})



  return response.status  == '200'

}
catch(e) {

  return false
}
}

export const set_tokens = async(account)=> {




  if ((await does_user_exists(account)))
  {
  if (!get_access_token()) {
  const is_cookie_present = await get_access_token_from_refresh()

  if (!(is_cookie_present.ok)) {
    
    set_access_token((await personal_sign(account)).token)
    return; 
  }
  
  else {
    set_access_token(is_cookie_present.accessToken)
    return; 
  }
}
}

else {
  return;
}
}
