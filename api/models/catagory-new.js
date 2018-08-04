/**
 * Created by bao.nguyen on Mar. 5, 2017.
 * ./models/category.js
 */

'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
/**
 * Category Schema
 */

// db.categories.createIndex(
//    {
//      name: "text",
//      description: "text",
//      "translation.content": "text",     
//    },
//    {
//      name: "CatTextIndex"
//    }   
// );
//
// db.categories.createIndex( { ancestors: 1 } );

// db.categories.createIndex( { path: 1 } );


const options = { autoIndex: false, safe: { j: 1, w: 1, wtimeout: 60000 } };

const CategorySchema = new Schema(
  {
    
    name: { type: String },
    lname: { type: String },
    description: { type: String },
    parentId: { type: String, default: '' },
    path: { type: String, default: '' },    
    logoImage: { 
      name: { type: String, default: '' },
      source: { type: String, default:'' }
    },
    createdDate: { type: Date, default: Date.now },
    lastUpdated: { type: Date, default: Date.now },
    isDeleted: { type: Boolean, default: false },
  }, options
);

/**
 * EXPORT MODEL
 */
module.exports = mongoose.model('category', CategorySchema, 'categories');
