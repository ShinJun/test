'use strict';

//const mongoose = require('mongoose');
const EventHandler = require('../../libs/event-handler'); 
const Combo = require('../models/item'); 
const ItemEvent = require('../models/item-event'); 

module.exports = {
  addCombo,  
  updateCombo,
  deleteCombo
};
/**
 * Add new item.
 * Will pub a message for a service sub to it. And, a service will build 
 * a categoryPath for this new item
 */
function addCombo(req, res) {
  const item = new Combo(req.swagger.params.Combo.value);
  item.restaurantId = req.swagger.params.restaurantId.value;
  item.categoryId = req.swagger.params.categoryId.value;
  item.lname = item.name.toLowerCase();

  const message = {
    itemId: item._id,
    restaurantId: item.restaurantId,
    event: 'addedCombo',
    // TODO: - the api-gateway will inject into the header when redirecting to order service.
    userId: '', 
    payload: { categoryId: item.categoryId }
  };
  item.save()
    .then(() => {
      return ItemEvent.create(message);
    })
    .then(() => {
      const eventHandler = new EventHandler();      
      return eventHandler.publish(eventHandler.topic.addedCombo, message);
    })
    .then(() => {
      res.json({           
          itemId: item._id,
          message: 'Success'
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ 
          code: 100, 
          message: 'Internal Server Error'
        });  
    });  
}
/**
 * Mark the combo isDeleted.
 * 
 */
function deleteCombo(req, res) {
  const itemId = req.swagger.params.comboId.value;
  Combo.findOneAndUpdate({ _id: itemId }, { isDeleted: true }, { new: true }).exec()
    .then(() => {
      res.json({           
          itemId,
          message: 'Success'
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ 
          code: 100, 
          message: 'Internal Server Error'
        });  
    });
}
/**
 * Update info of the item.
 * TODO: Should impletment JSON validator in order to allow which info can be used
 * for updating.
 */
function updateCombo(req, res) {
  const itemId = req.swagger.params.comboId.value;
  const item = req.swagger.params.Combo.value;
  const update = Object.assign(item, { $currentDate: { lastUpdated: true } });

  Combo.findOneAndUpdate({ _id: itemId }, update, { new: true }).exec()
    .then((doc) => {
      console.log(doc);
      res.json({           
          itemId,
          message: 'Success'
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ 
          code: 100, 
          message: 'Internal Server Error'
        });  
    });
}
 
