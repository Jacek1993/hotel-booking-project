import sendRequest from './sendRequest';

const loadRoom=()=>sendRequest(`/room/all`,{
    method: 'GET'
});

export {
    loadRoom
}