import sendRequest from './sendRequest'

const removeReservation=(slug, option)=>sendRequest(`/reservation/purge?reservationSlug=${slug}`,{
    method: 'DELETE',
    headers: option
});

const loadRoomWithReservations=({slug, startDate}, option)=>sendRequest(`/room/${slug}/reservation/${startDate}`,{
    method: 'GET',
    headers: option
} );

export {
    removeReservation,
    loadRoomWithReservations
}