import { RNS3 } from 'react-native-aws3';

export function query(url, method, body){   
    var myRequest = new Request(url, {
        method: method, 
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },        
        body: JSON.stringify(body)
    });
   
    return new Promise(function(resolve, reject){
        fetch(myRequest)
            .then(function(response) {       
                 if(response.status == 200) return response.json(); 
                 else{
                     throw new Error('Something went wrong on api server!');
                 }
            })
            .then(function(response) {                  
                return resolve(response);
            })
            .catch(function(error) {                             
                return reject(error) ;         
            })
    })
}


