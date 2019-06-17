import sendRequest from './sendRequest';

const create=({firstName, lastName, email, password })=>sendRequest(`/client/signup`,{
    body: JSON.stringify({firstName, lastName, email, password})
});

 const signin=({email, password})=> sendRequest(`/client/login`,{
        body: JSON.stringify({email, password})
    });

 const signOut=()=>sendRequest(`/client/me/token`,{
     method: 'DELETE'
 });

 const userCredentials=(slug)=>sendRequest(`/client/${slug}`,{
     method: 'GET'
 });

 const updateUser=({slug, userData})=>sendRequest(`/client/upload/${slug}`, {
     body:JSON.stringify(userData)
 });

 const loadOpenedReservations=()=>sendRequest(`/client/reservation/opened`,{
     method: 'GET'
 });


export {
    create,
    signin,
    signOut,
    userCredentials,
    updateUser,
    loadOpenedReservations
}