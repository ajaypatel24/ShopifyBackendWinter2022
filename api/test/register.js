const chai = require("chai");
const chaiHttp = require("chai-http")
const server = require("../server")


chai.should();

chai.use(chaiHttp);

var expect = chai.expect;

describe('Authentication API', () => {


    /* 
    chose not to mock database for this since it became too complex, 
    this test can be run once successfully to add new user
    */
    /*
    it("Attempting to add new user", () => {
        data = { //change to valid
            "email":"b@b.com"
            "password":"password"
        }
        return chai.request(server)
            .post("/register")
            .send(data)
            .then(function (res) {
                expect(res).to.have.status(200);
            })
            .catch(function (err) {
                throw err;
            })
    })
    */


    it("Attempting to Register Nothing", () => {
        data = { //change to valid
            
        }
        return chai.request(server)
            .post("/register")
            .send(data)
            .then(function (res) {
                expect(res).to.have.status(500);
            })
            .catch(function (err) {
                throw err;
            })
    })

    it("Attempting to Register With Only Email", () => {
        data = { //change to valid
            "email":"hello@live.com",
            
        }
        return chai.request(server)
            .post("/register")
            .send(data)
            .then(function (res) {
                expect(res).to.have.status(500);
            })
            .catch(function (err) {
                throw err;
            })
    })

    it("Attempting to Register With Only Password", () => {
        data = { //change to valid
            "password":"password"
        }
        return chai.request(server)
            .post("/register")
            .send(data)
            .then(function (res) {
                expect(res).to.have.status(500);
            })
            .catch(function (err) {
                throw err;
            })
    })

    it("Attempting to Register Existing User", () => {
        data = { //change to valid
            email: "newuser@gmail.com",
            password: "newPassword"
        }
        return chai.request(server)
            .post("/register")
            .send(data)
            .then(function (res) {
                expect(res).to.have.status(500);
            })
            .catch(function (err) {
                throw err;
            })
    })



})







    


