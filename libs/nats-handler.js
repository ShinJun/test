'use strict';
/**
 * Created by bao.nguyen on 02/01/17.
 * 
 * This module will be used to work with a message broker which could be mosquitto, rabbitmq or nats
 * 
 */

const nats = require('nats');
const config = require('../config/config')();

let client = null; 

class NatsHandler {

  constructor() {
    this.topic = config.nats.topic;
  }

  connect() {
    let servers = process.env.NATS_SERVERS;
    servers = servers ? servers.split(',') : config.nats.servers;
    client = nats.connect({ dontRandomize: true, servers });
    client.on('connect', () => client);
    client.on('error', (e) => { 
      console.log(`NATS error (in connect): ${e}`);
    });
  }

  publish(topic, message) {
    return new Promise((resolve, reject) => {
      client.publish(topic, JSON.stringify(message), () => {        
        resolve(message);
      });

      client.on('error', (e) => { 
        console.log(`NATS error (in public): ${e}`);
        reject(e); 
      });      
    });
  }

  subscribe(topic, callback) {
    client.subscribe(topic, { queue: config.nats.queue }, (message, replyTo, msgTopic) => {
      // In case we need to reply to the request(), use the subscribe(reqlyTo, ...) to do that.
      // Example: eventHandler.public(replyTo, message);
      callback(null, msgTopic, message, replyTo);
    });
  }
  /**
   * Request/Response with timeout
   */
  // Request with Auto-Unsubscribe. Will unsubscribe after
  // the first response is received via {'max':1}
  request(topic, message, timeout = 15000) {
    return new Promise((resolve, reject) => {
      const sid = client.request(topic, message, { max: 1 }, (response) => {
        console.log(`Got a response: ${response}`);
        resolve(response);
      });

      // Set timeout for the request after 15 sec as default.
      client.timeout(sid, timeout, 1, (id) => {
        console.log(`it is timeout: ${id}`);
        client.unsubscribe(sid);        
        reject('timeout');
      });      
    });
  }
}

module.exports = NatsHandler;
