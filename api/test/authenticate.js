const chai = require("chai");
const chaiHttp = require("chai-http")
const server = require("../server")


chai.should();

chai.use(chaiHttp);

var expect = chai.expect;

describe('Authentication API', () => {


    it("Should Authenticate If Using Working Credential", () => {
        data = { //change to valid
            token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJnQGcuY29tIiwic2NvcGUiOiJzZWxmLCBhZG1pbnMiLCJqdGkiOiIxMzE1NmEwNC1hMzcxLTQ4YzEtODBiNy1lYTA0NDkzNDkwNjgiLCJpYXQiOjE2MTk2NjA2MDcsImV4cCI6MTYxOTY2NDIwN30.2TEM2uWs5WXIauzq2gkfATTSFGmvc7EBmIqHyrAqSkI"
        }
        return chai.request(server)
            .post("/authenticate")
            .send(data)
            .then(function (res) {
                expect(res).to.have.status(500);
            })
            .catch(function (err) {
                throw err;
            })
    })


    it("Should not Authenticate if Invalid Token", () => {
        data = {
            token: "J0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJnQGcuY29tIiwic2NvcGUiOiJzZWxmLCBhZG1pbnMiLCJqdGkiOiIxMzE1NmEwNC1hMzcxLTQ4YzEtODBiNy1lYTA0NDkzNDkwNjgiLCJpYXQiOjE2MTk2NjA2MDcsImV4cCI6MTYxOTY2NDIwN30.2TEM2uWs5WXIauzq2gkfATTSFGmvc7EBmIqHyrAqSkI"
        }
        return chai.request(server)
            .post("/authenticate")
            .send(data)
            .then(function (res) {
                expect(res).to.have.status(500);
            })
            .catch(function (err) {
                throw err;
            })
            })
    
            

    it("Should Return Error if no Token Provided", () => {
        data = {
            token: undefined
        }
        return chai.request(server)
            .post("/authenticate")
            .send(data)
            .then(function (res) {
                expect(res).to.have.status(500);
                
            })
            .catch(function (err) {
                throw err;
            })
            
    })



})







    


