var kafka = require('kafka-node');
var Woof=function(url){
  var instance,client,producer,consumerMap=new Object();
  var default_producer_options={partition:0,attributes:2};
  var default_consumer_options = {
    autoCommit: true,
    autoCommitMsgCount: 100,
    autoCommitIntervalMs: 5000,
    fetchMaxWaitMs: 100,
    fetchMinBytes: 1,
    fetchMaxBytes: 1024 * 10,
    fromOffset: false,
    fromBeginning: false
  };
  if(!instance){
    instance=createKafkaInstance();
  }
  function createKafkaInstance(){
    client = new kafka.Client(url);
    producer=new kafka.HighLevelProducer(client);
  }
  function publishTopic(topic,data,options,cb){
    var keyedMessage=new kafka.KeyedMessage(data.key,data.value);
    var settings=generateSettings(default_producer_options,options);
    var payload = [{ topic: topic, messages: [keyedMessage],partition:settings.partition,attributes:settings.attributes}];
    producer.on('ready',function(){
      producer.send(payload,function(err,data){
          return cb(err,data)
      });
    });
  }
  function registerOffsetConsumer(topic,options,fn,cb){
    var settings=generateSettings(default_consumer_options,options);
    var consumer=consumerMap[topic];
    var offset = new kafka.Offset(client);
    if(!consumer){
      offset.fetch([
        { topic: topic,time: -1, maxNum: 1 }
      ], function (err, data) {
        var currentOffset=0;
        if(data)
          currentOffset=data[topic][0][0];
        consumer=new kafka.Consumer(client,[{topic:topic}],settings);
        consumer.setOffset(topic,0,currentOffset);
        consumerMap[topic]=consumer;
        consumer.on('message',function(message){
          fn(message);
        });
        if(cb)
          return cb(null,consumer);
      });
    }
    else{
      consumer.on('message',function(message){
        fn(message);
      });
      if(cb)
        return cb(null,consumer);
    }
  }
  function registerConsumer(topic,options,fn,cb){
    var settings=generateSettings(default_consumer_options,options);
    var consumer=consumerMap[topic];
    if(!consumer){
      consumer=new kafka.Consumer(client,[{topic:topic}],settings);
    }
    consumer.on('message',function(message){
      fn(message);
    });
    if(cb)
      return cb(null,consumer);
  }
  function generateSettings(obj1,obj2){
    var obj3={};
    for(var attr in obj1){
      obj3[attr]=obj2[attr] || obj1[attr];
    }
    return obj3;
  }
  return{
    publishTopic:publishTopic,
    registerConsumer:registerConsumer,
    registerOffsetConsumer:registerOffsetConsumer
  }
}
module.exports=Woof;
