const fetch_metadata = async (array_of_uris, numbers_of_tokens)=> {



async function fetchJSON(url) {
           
    const response = await fetch(url, {method: "GET"});

    const response_to_json = await response.json();
    
    return response_to_json;
  }


  const array_of_metadatas = await Promise.all(Array(parseInt(numbers_of_tokens)).fill().map(async (element, index)=> {
    return await fetchJSON(array_of_uris[index])
  }))
     return {
        array_of_metadatas,

    }
}

module.exports = fetch_metadata