const url = 'https://api.thegraph.com/subgraphs/name/pawelpiwowarski/plateau-marketplace'


export async function common_fetch(url, query) {


  const response = await fetch(url, {
    method: "POST", headers: {
        "Content-Type": "application/json",
        "Accept": "application.json"
    }, body:  JSON.stringify({query})



}
      )

    
const response_to_json = await response.json()
return response_to_json


}

export async function get_tokens_created_by_a_user(address) {
  const query = `
  {
    creators(where: {creator_contains: "` + address.toLowerCase()+`"}){
      id
    
    }
    }
  `

  const response = await common_fetch(url,query)


  return response.data.creators
}



export async function is_user_approved(address, address_of_the_marketplace) {

  const query = `
  {
    contracts(where: {id: "` + address_of_the_marketplace.toLowerCase() +`-` + address.toLowerCase() +`"}) {
      approved
    }
  
    
  }
  
  `
  const response = await common_fetch(url,query)


  return response.data.contracts[0]? response.data.contracts[0].approved: false

}

export async function get_tokens_owned_by_a_user(address) {

  const query = `
  {
  
    tokens(where: {owner_contains: "`+ address.toLowerCase() +`"})
    {
      tokenID
    }
  }


  `
  const response = await common_fetch(url,query)


return response


}
export async function fetch_transaction_history_from_the_graph(id) {
    const query = ` 

    {
        tokens(where: {tokenID: `+ id.toString()+`}) {
            
          tokenID
          owner {
            id
          }
        }
      
        
      }
      
    `


    const response = await common_fetch(url,query)


return response

}



export async function fetch_metadata_for_specific_token(id) {


  const query = `{
 
    uris(where: {token_id: `+ id.toString()+`}) {

      value
    }
  }`

  const response = await common_fetch(url,query)

  return response
}
export  async function fetch_metadata_from_the_graph() {

        const query = `{ uris(orderBy:token_id) {
          token_id
          value
        }
      }`;

          const response = await common_fetch(url,query)


return response

    


}



