import sendRequest from './sendRequest'

const removeReservation=(slug)=>sendRequest(`/reservation/purge?reservationSlug=${slug}`,{
    method: 'DELETE'
});

const loadRoomWithReservations=({slug, startDate}, option)=>sendRequest(`/room/${slug}/reservation/${startDate}`,{
    method: 'GET',
    headers: option
} );

export {
    removeReservation,
    loadRoomWithReservations
}