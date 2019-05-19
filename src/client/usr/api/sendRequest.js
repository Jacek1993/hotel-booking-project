import getRootUrl from './getRootUrl';
import axios from "axios";

async function sendRequest(path,options={}){
    const headers=Object.assign({}, options.headers|| {},{
        'Content-type': 'application/json; charset=UTF-8',
    });

    const response=await fetch(
        `${getRootUrl()}${path}`,
        Object.assign({method: 'POST', credentials: 'same-origin'}, options, {headers})
    );

    const data=await response.json();
    console.log(data);

    return data;
}

export function sendForm(url, formData){
    axios.post(`${getRootUrl()}${url}`, formData)
}
export default sendRequest;