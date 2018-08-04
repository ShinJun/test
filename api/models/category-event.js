/**
 * Created by bao.nguyen on 02/01/17.
 * 
 */

'use strict';

const mongoose = require('mongoose');

/**
 * Category Schema
 * Must run db.category_events.createIndex({ categoryId: 1, createdDate: 1})
 */
const options = { autoIndex: false, safe: { j: 1, w: 1, wtimeout: 60000 } };
const Schema = mongoose.Schema;
const CategoryEventSchema = new Schema({
    categoryId: { type: String },  
    restaurantId: { type: String },      
    event: { type: String },
    userId: { type: String }, // logged in user
    createdDate: { type: Date, default: Date.now },    
    payload: { type: Object }
  }, options);

/**
 * EXPORT MODEL
 */
module.exports = mongoose.model('category_event', CategoryEventSchema);
