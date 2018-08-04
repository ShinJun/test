/**
 * Created by bao.nguyen on 02/01/17.
 * 
 */

'use strict';

const mongoose = require('mongoose');

/**
 * Item Schema
 * Must run db.item_events.createIndex({ itemId: 1, createdDate: 1})
 */
const options = { autoIndex: false, safe: { j: 1, w: 1, wtimeout: 60000 } };
const Schema = mongoose.Schema;
const ItemEventSchema = new Schema({
    itemId: { type: String },  
    restaurantId: { type: String },      
    event: { type: String },
    userId: { type: String }, // logged in user.
    createdDate: { type: Date, default: Date.now },
    payload: { type: Object }
  }, options);

/**
 * EXPORT MODEL
 */
module.exports = mongoose.model('item_event', ItemEventSchema);
