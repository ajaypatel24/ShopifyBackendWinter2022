const chai = require("chai");
const chaiHttp = require("chai-http")
const server = require("../server")


chai.should();

chai.use(chaiHttp);

var expect = chai.expect;

describe('Access Rights API', () => {


    it("Attempting to Private Non-Existant Photo", () => {
        
        return chai.request(server)
            .post("/private/fds.png/private")
            
            .then(function (res) {
                expect(res).to.have.status(500);
            })
            .catch(function (err) {
                throw err;
            })
    })

    it("Attempting Invalid Privacy Operation on Non-Existant Photo", () => {
        
        return chai.request(server)
            .post("/private/fds.png/nbate")
            
            .then(function (res) {
                expect(res).to.have.status(500);
            })
            .catch(function (err) {
                throw err;
            })
    })

    it("Attempting to Private Existing Photo", () => {
        
        return chai.request(server) 
            .post("/private/1619673287803.png/private")
            
            .then(function (res) {
                expect(res).to.have.status(200);
            })
            .catch(function (err) {
                throw err;
            })
    })

    it("Passing Photo with no Privacy Parameter", () => {
        
        return chai.request(server) 
            .post("/private/1619673287803.png/")
            
            .then(function (res) {
                expect(res).to.have.status(404);
            })
            .catch(function (err) {
                throw err;
            })
    })

    

    it("Privacy attempt with no parameters", () => {
        
        return chai.request(server) 
            .post("/private/")
            
            .then(function (res) {
                expect(res).to.have.status(404);
            })
            .catch(function (err) {
                throw err;
            })
    })



    


    



})







    


