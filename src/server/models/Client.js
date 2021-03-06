import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import bcryptjs from 'bcryptjs';
import generateSlug from '../utils/slugify';
import jsonWebToken from '../utils/jsonWebToken';
import validator from 'validator';


const ClientSchema = new mongoose.Schema({
    firstName: {type: String, require: true},
    lastName: {type: String, require: true},
    email: {
        type: String,
        require: true,
        validate: {validator: validator.isEmail, message: '{VALUE} is not a valid email'}
    },
    phoneNumber: {type: String},
    password: {type: String, require: true},
    role: {type: String},
    slug: {type: String},
    reservation: [{type: mongoose.Schema.ObjectId, ref: 'Reservation'}],
    opinions: [{type: mongoose.Schema.ObjectId, ref: 'Opinion'}],
    tokens: [{
        access: {
            type: String,

        },
        token: {
            type: String,

        }
    }],
    photography: {type: String}

});


class ClientClass {
    static async add(body) {
        console.log('Reservation add weszlo');
        const slug = await generateSlug(this, body.firstName);
        console.log('generating slug', slug);
        if (!slug) {
            return Promise.reject('Something went wrong');
        }
        let firstName = body.firstName;
        let lastName = body.lastName;
        let email = body.email;
        let password = body.password;

        return this.create({
            firstName,
            lastName,
            slug,
            email,
            password
        });
    }


    async generateAuthToken() {
        let user = this;
        let access = process.env.PAYLOAD_AUTH;

        jsonWebToken.subject = user.email;
        var token = await jwt.sign({
            _id: user._id.toHexString(),
            access
        }, process.env.PRIVATE_KEY, jsonWebToken);

        user.tokens = user.tokens.concat({access, token});
        return user.save().then(() => {
            console.log('token', token);
            return token;
        });
    }

    async generateAuthTokenRegistration(options) {
        let user = this;
        let access = process.env.PAYLOAD_AUTH;
        console.log(`In createTokenRegistration function ${JSON.stringify(jsonWebToken)}`);

        jsonWebToken.subject = user.email;
        var payload = {
            _id: user._id,
            access: process.env.PAYLOAD_AUTH,
        };
        let token = await jwt.sign(payload, process.env.PRIVATE_KEY, jsonWebToken);

        if (!options) {
            user.role = 'user';
            console.log('go to user');
            user.tokens = user.tokens.concat({access, token});
            return Promise.resolve(user.save().then(() => {
                console.log('token', token);
                return token;
            }));
        }
        else {
            return new Promise((response, reject) => {
                bcrypt.compare(options, process.env.OWNER_PASSWORD, (err, res) => {
                    if (res) {
                        user.role = 'admin';
                        console.log('go to admin');
                        user.tokens = user.tokens.concat({access, token});
                        response(user.save().then(() => {
                            console.log('token', token);
                            return token;
                        }));
                    }
                    else {
                        reject(`Application owner password doesn't compare try again`);
                    }
                })
            });
        }

    }

    static findByToken(token) {
        let user = this;
        let decode;
        jsonWebToken.subject = user.email;

        try {
            console.log('token ', token);
            decode = jwt.verify(token, process.env.PUBLIC_KEY, jsonWebToken);
            console.log(decode)
        }
        catch (e) {
            return Promise.reject(`cannot find user with this token ${token}`)
        }
        console.log('in findByToken()')
        return user.findOne({
            '_id': decode._id,
            'tokens.token': token,
            'tokens.access': 'auth'
        })
    }

    static findByCredentials(email, password) {
        let user = this;
        return user.findOne({email}).then((user) => {
            if (!user) {
                return Promise.reject(`There is no such user with email: ${email}`)
            }
            return new Promise((response, reject) => {
                bcrypt.compare(password, user.password, (err, res) => {
                    if (res) {
                        response(user);
                    }
                    else {
                        reject(`User with email: ${email} has invalid password`);
                    }
                })
            })
        })
    }

    removeToken(token) {
        let user = this;
        return user.update({
            $pull: {
                tokens: {
                    token: token
                }
            }
        })
    }

    static async findAnyProcessedReservation(slug) {
        return await Client.aggregate([
            {
                $match: {slug: slug}
            },
            {
                $lookup: {
                    from: 'reservations',
                    localField: 'reservation',
                    foreignField: '_id',
                    as: 'reservation_table'
                }
            },
            {$unwind: '$reservation_table'},
            {
                $lookup: {
                    from: 'rooms',
                    localField: 'reservation_table.reservedRooms',
                    foreignField: '_id',
                    as: 'room_table'
                }
            },
            {$match: {"reservation_table.state": 'PROCESSED'}},
            {
                $project: {
                    "reservation_table.name": 0,
                    "reservation_table.reservedRooms": 0,
                    "reservation_table.userSlug": 0,
                    "reservation_table.user": 0,
                    "reservation_table.__v": 0,
                    "reservation_table.state": 0,
                    "reservation_table._id": 0,
                    "reservation_table.totalAmount": 0,
                    "reservation_table.createdAt": 0,
                    _id: 0,
                    firstName: 0,
                    lastName: 0,
                    slug: 0,
                    email: 0,
                    password: 0,
                    reservation: 0,
                    tokens: 0,
                    opinions: 0,
                    photography: 0,
                    phoneNumber: 0,
                    role: 0,
                    __v: 0
                }
            }

        ])


    }


}


ClientSchema.methods.toJSON = function () {
    let user = this;
    let userObject = user.toObject();
    return _.pick(userObject, ['_id', 'email', 'slug', 'firstName', 'lastName', 'reservation']);
};
//middleware to hash user password
ClientSchema.pre('save', function (next) {
    let user = this;
    if (user.isModified('password')) {
        bcryptjs.genSalt(10, (err, salt) => {
            bcryptjs.hash(user.password, salt, (err, hash) => {
                user.password = hash;

                next();
            })
        });
    } else {
        next();
    }
});

ClientSchema.pre('remove', function (next) {
    this.model('Reservation').remove({user: this._id}, next);
    this.model('Opinion').remove({_id: {$in: this.opinions}}, next);

});

ClientSchema.loadClass(ClientClass);
let Client = mongoose.model('Client', ClientSchema);
export {Client};