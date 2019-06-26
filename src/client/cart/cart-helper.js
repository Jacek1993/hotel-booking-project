import {
    addRoomToReservation,
    createReservation,
    removeReservation,
    removeRoomFromRerservation
} from "../api/api-reservation";
import queryString from 'querystring'
import {getReservationSlug} from "../api/utils";

const cart = {
    itemTotal() {
        if (typeof window !== 'undefined') {
            if (localStorage.getItem('cart')) {
                return JSON.parse(localStorage.getItem('cart')).length
            }
        }
        return 0;
    },
    addItem(room, startDate, endDate, cb) {
        let cart = [];
        if (typeof window !== 'undefined') {
            if (localStorage.getItem('cart')) {
                cart = JSON.parse(localStorage.getItem('cart'));
                let sign = false;
                cart.forEach((item) => {
                    if (item.slug === room.slug) sign = true
                });
                console.log(sign)
                if (sign) {
                    console.log('something is no yes again')
                    cb();
                    return;
                }
            }
            else {
                createReservation({startDate, finishDate: endDate}).then((data) => {
                    if (!data.error) {
                        console.log(data)
                        localStorage.setItem('reservation', JSON.stringify({slug: data.slug, startDate, endDate}))
                    }
                })
            }
            const reservationSlug = getReservationSlug();
            addRoomToReservation({roomSlug: room.slug, reservationSlug}).then((data) => {
                if (!data.error) {
                    console.log(data)
                } else {
                    console.log(data.error)
                }
            })
            cart.push(room)
            localStorage.setItem('cart', JSON.stringify(cart));
            cb();
        }
    },
    getCart() {
        if (typeof window !== 'undefined') {
            if (localStorage.getItem('cart')) {
                return JSON.parse(localStorage.getItem('cart'))
            }
        }
        return []
    },
    removeItem(itemIndex) {
        let cart = [];
        if (typeof window !== 'undefined') {
            if (localStorage.getItem('cart')) {
                cart = JSON.parse(localStorage.getItem('cart'))
            }
            const room = cart[itemIndex];
            cart.splice(itemIndex, 1);
            localStorage.setItem('cart', JSON.stringify(cart))
            const reservationSlug = getReservationSlug();
            const query = {};
            query.roomSlug = room.slug;
            query.reservationSlug = reservationSlug;
            removeRoomFromRerservation(queryString.stringify(query)).then((data) => {
                if (data.error) {
                    console.log(data.error);
                }
            })

        }
        return cart;
    },
    removeReservation() {
        if (typeof window !== 'undefined') {
            const reservationSlug = getReservationSlug();
            removeReservation(reservationSlug).then((data) => {
                if (data.error) {
                    console.log(data);
                }
            });
            localStorage.removeItem('reservation');
            localStorage.removeItem('cart');

        }
    },
    emptyCart() {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('reservation');
            localStorage.removeItem('cart');
        }

    }
}

export default cart;