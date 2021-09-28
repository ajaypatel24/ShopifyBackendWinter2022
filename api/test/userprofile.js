const chai = require("chai");
const chaiHttp = require("chai-http")
const server = require("../server")


chai.should();

chai.use(chaiHttp);

var expect = chai.expect;

describe('Public Profile API', () => {


    
    it("Attempting to get Profile of Non-Existant User", () => {

        return chai.request(server)
            .get("/userprofile/gdalj")
            .then(function (res) {
                expect(res).to.have.status(500);
            })
            .catch(function (err) {
                throw err;
            })
    })

    it("Attempting to get Profile of Existing User", () => {

        return chai.request(server)
            .get("/userprofile/g@g.com")
            .then(function (res) {
                expect(res).to.have.status(200);
            })
            .catch(function (err) {
                throw err;
            })
    })

    it("Attempting to get Profile of No User", () => {

        return chai.request(server)
            .get("/userprofile/")
            .then(function (res) {
                expect(res).to.have.status(404);
            })
            .catch(function (err) {
                throw err;
            })
    })

    

    



})







    


