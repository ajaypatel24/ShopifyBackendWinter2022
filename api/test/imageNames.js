const chai = require("chai");
const chaiHttp = require("chai-http")
const server = require("../server")


chai.should();

chai.use(chaiHttp);

var expect = chai.expect;

describe('Image Collection API', () => {

    it("Get Images from Existing User", () => {
        
        return chai.request(server)
            .get("/imageNames/g@g.com")
            .then(function (res) {
                expect(res).to.have.status(200);
            })
            .catch(function (err) {
                throw err;
            })
    })


    it("Attempt to Retrieve Images from Non-Existant User", () => {
        
        return chai.request(server)
            .get("/imageNames/eg")
            .then(function (res) {
                expect(res).to.have.status(500);
            })
            .catch(function (err) {
                throw err;
            })
    })

    

    

})







    


