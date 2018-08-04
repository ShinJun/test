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
    restaurantId: { type: String },
    name: { type: String },
    lname: { type: String },
    serviceFee: { type: Number},
    isPlusPlusSign: { type: Boolean},
    taxName: {type: String},
    taxFee: {type: Number},
    description: { type: String },
    language: { type: String, default: 'english' },	
    translation: [{
      _id: false,
      fieldName: { type: String, default: '' }, // E.g. "description" will be translated
      content: { type: String, default: '' }, // E.g. "Sách tham khảo"
      languageCode: { type: String, default: '' }, // E.g. "vi" used for filtering by app
      language: { type: String, default: 'none' } // Some languages are not supported   
    }],
    parentId: { type: String, default: '' },
    path: { type: String, default: '' },    
    assets: {
      thumbnail: {
        source: { type: String, default: '' },
        awsKey: { type: String, default: '' }
      },
      images: [{
        source: { type: String, default: '' },
        awsKey: { type: String, default: '' }
      }]
    },
    createdDate: { type: Date, default: Date.now },
    lastUpdated: { type: Date, default: Date.now },
    isDeleted: { type: Boolean, default: false },
  }, options
);

/**
 * EXPORT MODEL
 */
module.exports = mongoose.model('category123', CategorySchema, 'categories');
