const fetch_metadata = async (array_of_uris, numbers_of_tokens)=> {


let contentType
const array_of_metadatas = []
const array_of_responses = []
async function fetchJSON(url) {
           
    const response = await fetch(url, {method: "GET"});

    const response_to_json = await response.json();
    console.log(response_to_json)
    
    return response_to_json;
  }

  
  for (let i=0 ; i < numbers_of_tokens; i++) {
    let uri = await fetchJSON(array_of_uris[i])
    array_of_metadatas.push(uri)
    try {
    let res = await fetch(array_of_metadatas[i].image);
    contentType = res.headers.get('Content-Type');
    array_of_responses.push(contentType)
    }
    catch { 
      contentType = 'none'
      array_of_responses.push(contentType)
    }  
  }


    
     return {
        array_of_metadatas,
        array_of_responses
    }
}

module.exports = fetch_metadata