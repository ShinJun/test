'use strict';
/**
 * Created by bao.nguyen on 02/01/17.
 * 
 * This module will be used to work with a message broker which could be mosquitto, rabbitmq or nats
 * 
 */

const mqtt = require('mqtt');
const config = require('../config/config')();

let client = null; 

class MQTTHandler {
  
  constructor() {
    this.topic = config.mqtt.topic;
  }

  connect() {
    const { host, port } = config.mqtt;
    const server = process.env.MQTT_SERVER ? process.env.MQTT_SERVER : `mqtt://${host}:${port}`;
    client = mqtt.connect(server);
    client.on('connect', () => client);    
  }

  publish(topic, message) {
    return new Promise((resolve, reject) => {      
      client.publish(topic, JSON.stringify(message), { qos: 2 }, (err, data) => {
        if (err) {
          reject(err);
        }
        
        resolve(data);
      });      
    });    
  }

  subscribe(topics, callback) {
    client.on('message', (topic, message) => {
      // message is Buffer 
      callback(null, topic, message.toString());      
    });
  }
}

module.exports = MQTTHandler;
