# Node-Woof
Persistent messaging library for Node

## Introduction
Persistent messaging library which offers various flavors of messaging; optimizing for throughput, latency etc

Currently there is support for paritioned , persistent queues which use Apache Kafka and kafka-node as the client module.


## Sample Usage

**Producer**
```javascript
var Woof = require('../woof/woof');
var woofObject=new Woof("localhost:2181");
woofObject.publishTopic('test7',{key:'key',value:'value'},{},function(err,data){
  console.log(data);
});

```
**Consumer**
```javascript
var Woof = require('../woof/woof');
var woofObject=new Woof("localhost:2181");
woofObject.registerOffsetConsumer('test7',{fromOffset:true},console.log);
