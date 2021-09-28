const chai = require("chai");
const chaiHttp = require("chai-http")
const server = require("../server")


chai.should();

chai.use(chaiHttp);

var expect = chai.expect;

describe('User Like API', () => {



    it("Adding Like To Existing Photo", () => {
        data = { //change to valid
            
        }
        return chai.request(server)
            .post("/like/1619671987006.png/g@g.com")
            .send(data)
            .then(function (res) {
                expect(res).to.have.status(200);
            })
            .catch(function (err) {
                throw err;
            })
    })

    it("Adding Like to Non-Existant Photo From Non-Existant User", () => {
        data = { //change to valid
            
        }
        return chai.request(server)
            .post("/like/1hgf14/g.com")
            .send(data)
            .then(function (res) {
                expect(res).to.have.status(500);
            })
            .catch(function (err) {
                throw err;
            })
    })

    
  

})







    


