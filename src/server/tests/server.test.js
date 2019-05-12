import expect from 'expect';
import request from 'supertest';
import {ObjectID} from 'mongodb';

import {app} from '../server';
import {Client} from '../models/Client';
import {clients, populateClients} from './seed/seed';

beforeEach(populateClients);

describe('POST /users/login ', ()=>{
    it('should login user and return auth token', (done)=>{
        request(app)
            .post('/client/login')
            .send({
                email: clients[0].email,
                password: clients[0].password
            })
            .expect(200)
            .expect((res)=>{
                expect(res.headers['x-auth']).toBeTruthy();
            })
            .end((err, res)=>{
                if(err){
                    return done(err);
                }

                Client.findById(clients[0]._id).then((client)=>{
                    expect(client.tokens[0]).toMatchObject({
                        access: 'auth',
                        token: res.headers['x-auth']
                    });
                    done();
                }).catch((e)=>done(e));
            });
    });

    it('should reject invalid login', (done)=>{
        request(app)
            .post('/client/login')
            .send({
                email: clients[0].email,
                password: clients[0].password+'1'
            })
            .expect(400)
            .expect((res)=>{
                expect(res.headers['x-auth']).toBeFalsy()
            })
            .end((err, res)=>{
                if(err){
                    return done(err)
                }
                Client.findById(clients[0]._id).then((client)=>{
                    expect(client.tokens.length).toBe(0);
                    done();
                }).catch((e)=>done(e));
            });
    });

});


describe('POST /client/signup', ()=>{

    it('should create a client', (done)=>{
        let email='example@example.com';
        let password='123abc';
        let firstName= 'Marcin';
        let lastName= 'Rybacki';

        request(app)
            .post('/client/signup')
            .send({email, password, firstName, lastName})
            .expect(200)
            .expect((res)=>{
             //   expect(res.headers['x-auth']).toBeTruthy();
               expect(res.body.firstName).toBe(firstName);
               expect(res.body.lastName).toBe(lastName);
                expect(res.body.email).toBe(email);

            })
            .end((err)=>{
                if(err){
                    return done(err);
                }

                Client.findOne({email}).then((client)=>{
                    expect(client).toBeTruthy();
                    expect(client.password).not.toBe(password);
                    done();
                }).catch((e)=>done(e));
            });
    });

    it('should not create client if email in user', (done)=>{
        request(app)
            .post('/client/signup')
            .send({
                email: clients[0].email,
                password: 'password123'
            })
            .expect(409)
            .end(done);
    });

    it('should return validation errors if request invalid', (done)=>{
        request(app)
            .post('/client/signup')
            .send({
                email: 'and',
                password: '1234'
            })
            .expect(400)
            .end(done);
    });



})