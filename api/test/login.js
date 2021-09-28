const chai = require("chai");
const chaiHttp = require("chai-http")
const server = require("../server")


chai.should();

chai.use(chaiHttp);

var expect = chai.expect;

describe('Login API', () => {


    it("Attempting to Login with Credentials", () => {
        data = { //change to valid
            "email":"g@g.com",
            "password":"hello"
        }
        return chai.request(server)
            .post("/login")
            .send(data)
            .then(function (res) {
                expect(res).to.have.status(200);
            })
            .catch(function (err) {
                throw err;
            })
    })

    it("Attempting to Login with Invalid Credentials", () => {
        data = { //change to valid
            "email":"g@g.com",
            "password":"fdhsjkf"
        }
        return chai.request(server)
            .post("/login")
            .send(data)
            .then(function (res) {
                expect(res).to.have.status(200);
                
            })
            .catch(function (err) {
                throw err;
            })
    })

    it("Attempting to Login with No Credentials", () => {
        data = { //change to valid
           
        }
        return chai.request(server)
            .post("/login")
            .send(data)
            .then(function (res) {
                expect(res).to.have.status(200);
            })
            .catch(function (err) {
                throw err;
            })
    })


    



})







    


