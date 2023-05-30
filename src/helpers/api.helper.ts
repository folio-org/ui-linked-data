export const loadSimpleLookup = async (uris: string | string[]): Promise<LoadSimpleLookupResponseItem[] | undefined> => {
    // TODO make this better for multuple lookup list (might not be needed)
    if (!Array.isArray(uris)){
        uris=[uris]
    }
  
    for (const uri of uris){
        let url = uri
        // TODO more checks here
        if (!uri.includes('.json')){
            url += '.json'
        }
  
        const data = await fetchSimpleLookup(url)
        return data 
    }
  };
  
  // TODO: It's return different response depending on the uri. How to type this? 
  const fetchSimpleLookup = async (url: string, json?: boolean): Promise<any> => {
    if (url.includes("id.loc.gov")){
      url = url.replace('http://','https://')
    }
  
    // if we use the memberOf there might be a id URL in the params, make sure its not https
    url = url.replace('memberOf=https://id.loc.gov/','memberOf=http://id.loc.gov/')
  
    let options = {}
    if (json){
      options = { 
            headers: {
                'Content-Type': 'application/json', 
                'Accept': 'application/json'
            }, 
            mode: "cors"
        }        
    }
  
    try{
      const response = await fetch(url,options);
      let data = null
  
      if (url.includes('.rdf') || url.includes('.xml')){
        data = await response.text()
      }else{
        data = await response.json()
      }
      return  data;
    } catch(err) {
      console.error(err);
    }
  };