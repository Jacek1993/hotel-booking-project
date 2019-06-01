import sendRequest from './sendRequest';

const loadRoom=()=>sendRequest(`/room/all`,{
    method: 'GET'
});

const createRoom=({roomNumber,personAmount, description, pricing })=>sendRequest(`/room/`,{
    body: JSON.stringify({roomNumber, personAmount , description, pricing})
});

const removeRoom=(slug)=>sendRequest(`/room/${slug}`, {
    method: 'DELETE'
});

const updateRoom=({slug, roomData})=>sendRequest(`/room/update/${slug}`,{
    body: JSON.stringify(roomData)
})

export {
    loadRoom,
    createRoom,
    removeRoom,
    updateRoom
}