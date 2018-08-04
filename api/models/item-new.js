/**
 * Created by bao.nguyen on Mar. 5, 2017.
 * ./models/item.js
 */

'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
/**
 * Item Schema
 */

// db.items.createIndex(
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

// db.items.createIndex( { path: 1 } );

const options = { autoIndex: false, safe: { j: 1, w: 1, wtimeout: 60000 } };

const Price = new Schema({
  price: { type: Number },
  sale: {
    salePrice: { type: Number, default: 0 },
    saleEndDate: { type: Date, default: '' }
  }
}, { _id: false });

const ItemSchema = new Schema(
  {
    categoryPath: { type: String, default: '' },
    categoryId: { type: String },    
    name: { type: String },
    lname: { type: String },
    description: [{
      image: {
        name: {type: String, default: '' },
        source: {type: String, default: '' },
      },
      mainText: {type: String, default: '' },
      midText: {type: String, default: '' },
      subText: {type: String, default: '' }
    }],
    price: Price,
    sliderImage: {
      sliderText: { type: String, default: ''},
      image: [{
        name: { type: String, default: '' },
        source: { type: String, default: '' }
      }]
    },
    isHot: { type: Boolean, default: false },
    isPromotion:  { type: Boolean, default: false},
    createdDate: { type: Date, default: Date.now },
    lastUpdated: { type: Date, default: Date.now },
    isDeleted: { type: Boolean, default: false },
  }, options
);

/**
 * EXPORT MODEL
 */
module.exports = mongoose.model('item', ItemSchema);
