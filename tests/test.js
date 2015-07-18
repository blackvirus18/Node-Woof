var assert = require('chai').assert;
var Woof = require('../woof/woof');
describe('Woof Services',function(){
  woofObject=new Woof();
  it('should publish the topic',function(done){
    woofObject.publishTopic('test7',{key:'key',value:'value'},{},function(err,data){
      assert(data.test7);
      done();
    });
  });
  it('should register a consumer',function(done){
    woofObject.registerConsumer('test7',{},console.log,function(err,data){
      assert(data);
      done();
    });
  });
});
