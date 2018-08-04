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

const Translation = new Schema({    
  fieldName: { type: String }, // E.g. "description" will be translated
  content: { type: String }, // E.g. "Sách tham khảo"
  languageCode: { type: String }, // E.g. "vi" used for filtering by app
  language: { type: String, default: 'none' } // Some languages are not supported
}, { _id: false });

const Price = new Schema({
  price: { type: Number },
  sale: {
    salePrice: { type: Number, default: 0 },
    saleEndDate: { type: Date, default: '' }
  }
}, { _id: false });

const ItemSchema = new Schema(
  {
    restaurantId: { type: String },
    categoryPath: { type: String, default: '' },
    categoryId: { type: String },    
    name: { type: String },
    lname: { type: String },
    description: { type: String },
    language: { type: String, default: 'english' },	
    price: Price,
    translation: [Translation],    
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
    addOns: [
      {
        name: { type: String },
        description: { type: String },
        displayType: { type: String },
        translation: [Translation],
        options: [
          {
            name: { type: String },
            price: Price,
            selected: { type: Boolean },
            translation: [Translation]
          }
        ]
      }
    ],
    // For combo item.
    itemsGroup: [
      {
        name: { type: String },
        description: { type: String },
        displayType: { type: String },
        translation: [Translation],
        items: [{ type: String }]
      }
    ],
    createdDate: { type: Date, default: Date.now },
    lastUpdated: { type: Date, default: Date.now },
    isDeleted: { type: Boolean, default: false },
  }, options
);

/**
 * EXPORT MODEL
 */
module.exports = mongoose.model('item', ItemSchema);
