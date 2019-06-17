import sendRequest from './sendRequest'

const removeReservation=(slug, option={})=>sendRequest(`/reservation/purge?reservationSlug=${slug}`,{
    method: 'DELETE',
    headers: option
});

const removeRoomFromRerservation=(query)=>sendRequest(`/reservation?${query}`, {
    method: 'DELETE'
})

const loadRoomWithReservations=({slug, startDate}, option)=>sendRequest(`/room/${slug}/reservation/${startDate}`,{
    method: 'GET',
    headers: option
} );

const createReservation=({startDate, finishDate})=>sendRequest(`/reservation`,{
    body: JSON.stringify({startDate, finishDate})
});

const addRoomToReservation=({roomSlug, reservationSlug})=>sendRequest(`/reservation/room/add`,{
    method: 'PUT',
    body: JSON.stringify({roomSlug, reservationSlug})
});

const changeState=(query)=>sendRequest(`/reservation/change?${query}`, {
    method: 'PUT'
})

const loadReservation=(slug)=>sendRequest(`/reservation/${slug}`, {
    method: 'GET'
})

export {
    removeReservation,
    loadRoomWithReservations,
    createReservation,
    addRoomToReservation,
    changeState,
    loadReservation,
    removeRoomFromRerservation
}