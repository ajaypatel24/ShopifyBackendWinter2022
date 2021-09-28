const chai = require("chai");
const chaiHttp = require("chai-http")
const server = require("../server")


chai.should();

chai.use(chaiHttp);

var expect = chai.expect;

describe('Delete Image API', () => {

    it("Delete Non-Existant Image", () => {
        
        return chai.request(server)
            .post("/delete/gfhdkj.png")
            
            .then(function (res) {
                expect(res).to.have.status(500);
            })
            .catch(function (err) {
                throw err;
            })
    })

    it("Delete Nothing", () => {
        
        return chai.request(server)
            .post("/delete/")
            
            .then(function (res) {
                expect(res).to.have.status(404);
            })
            .catch(function (err) {
                throw err;
            })
    })

   

    

})


