const url = 'https://api.thegraph.com/subgraphs/name/pawelpiwowarski/plateau-salesv2' 

import { common_fetch } from "./grapql_query"

export async function fetch_sales_for_id(id, address) {

    const query = `

    {
      sells(where: {id_of_the_token: "${id}", contract: "${address.toLowerCase()}"})
      {
      
          seller
          buyer
          price
          time
          id_of_the_token
        }
      }
      
    
    `


    const response = await common_fetch(url,query)

    return response.data.sells.reverse()
}