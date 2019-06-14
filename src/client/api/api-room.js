import sendRequest from './sendRequest';

const loadRoom=()=>sendRequest(`/room/all`,{
    method: 'GET'
});

const createRoom=({roomNumber,personAmount, description, pricing, tags })=>sendRequest(`/room/`,{
    body: JSON.stringify({roomNumber, personAmount , description, pricing, tags})
});

const removeRoom=(slug)=>sendRequest(`/room/${slug}`, {
    method: 'DELETE'
});

const updateRoom=({slug, roomData})=>sendRequest(`/room/update/${slug}`,{
    body: JSON.stringify(roomData)
});

const search=(queries)=>sendRequest(`/room/?${queries}`,{
    method: 'GET'
});

const findRoomBySlug=(slug)=>sendRequest(`/room/view/${slug}`, {
    method: 'GET'
});

const findRoomByStartFinishDate=(queries)=>sendRequest(`/room/rooms/?${queries}`,{
    method: 'GET'
});

export {
    loadRoom,
    createRoom,
    removeRoom,
    updateRoom,
    search,
    findRoomBySlug,
    findRoomByStartFinishDate
}