let expect = require('chai').expect;
let request = require('request');

describe('repo and response', function() {
    describe ('Repo fetch', function() {
        it('status', function(done){
            // timeout is neccesary because the endpoint makes a third party api call
            this.timeout(10000);
            request('http://localhost:3001/user/github/repo/layne74', function(error, response, body) {
                expect(response.statusCode).to.equal(200)
                done();
            });
        });
        it('response', function(done) {
            // timeout is neccesary because the endpoint makes a third party api call
            this.timeout(10000);
            request('http://localhost:3001/user/github/repo/layne74', function(error, response, body) {
                expect(response).to.be.a("object");
                done();
            });
        });
    });
});