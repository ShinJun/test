'use strict';

const config = {    
    development: {
        mode: 'development',
        serviceName: 'dh-catalog',
        dbHost: 'localhost',        
        dbURL: process.env.DB_URL || 'mongodb://localhost:27017/dh-services',
        defaultLang: 'en-US',
        mqtt: {
            method: 'mqtt',
            port: 1883,
            host: 'test.mosquitto.org',
            topic: {
                all: '/catalog/+/',
            }
        },
        nats: {
            method: 'nats',
            servers: [
                'nats://localhost:4222',
                'nats://service:Services234DH@nats-cluster-node-1:4222'
            ],
            queue: 'catalog',
            topic: {
                all: 'catalog.>',
                addedSubCategory: 'catalog.added-subcategory',
                movedCategory: 'catalog.moved-category',
                deletedCategory: 'catalog.moved-category',
                addedItem: 'catalog.added-item',
                addedCombo: 'catalog.added-combo',                
            }
        },        
        requestLimit: '50mb',
        uploadDir: '/tmp'
    },
    production: {
        mode: 'production',
        serviceName: 'dh-catalog',
        dbHost: 'localhost',        
        dbURL: process.env.DB_URL || 'mongodb://localhost:27017/dh-services',
        defaultLang: 'en-US',
        mqtt: {
            method: 'mqtt',
            port: 1883,
            host: 'test.mosquitto.org',
            topic: {
                all: '/catalog/+/',
            }
        },
        nats: {
            method: 'nats',            
            servers: [
                'nats://localhost:4222',
                'nats://service:Services234DH@nats-cluster-node-1:4222'
            ],
            queue: 'catalog',
            topic: {
                all: 'catalog.>',
                addedSubCategory: 'catalog.added-subcategory',
                movedCategory: 'catalog.moved-category',
                deletedCategory: 'catalog.moved-category',
                addedItem: 'catalog.added-item',
                addedCombo: 'catalog.added-combo',                
            }
        },        
        requestLimit: '50mb',
        uploadDir: '/tmp'
    }
};

module.exports = function (mode) { 
    return config[mode || process.env.NODE_ENV] || config.production;
};
