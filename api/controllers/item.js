'use strict';

//const mongoose = require('mongoose');
const EventHandler = require('../../libs/event-handler');
const Item = require('../models/item');
const ItemEvent = require('../models/item-event');
const Util = require('../../libs/util');

module.exports = {
  addItem,
  deleteItem,
  updateItem,
  isDeletedItem,
  validateItem
};
/**
 * Add new item.
 * Will pub a message for a service sub to it. And, a service will build
 * a categoryPath for this new item
 */
function addItem(req, res) {
  const item = new Item(req.swagger.params.Item.value);
  item.restaurantId = req.swagger.params.restaurantId.value;
  item.categoryId = req.swagger.params.categoryId.value;
  console.log(req.swagger.params.restaurantId);
  item.lname = item.name.toLowerCase();

  const message = {
    itemId: item._id,
    restaurantId: item.restaurantId,
    event: 'addedItem',
        // TODO: - the api-gateway will inject into the header when redirecting to order service.
    userId: '',
    payload: { categoryId: item.categoryId }
  };

  const eventHandler = new EventHandler();
  const topic = eventHandler.topic;

  Util.checkObjectId(item.categoryId)
    .then(() => {
      return item.save();
    })
    .then(() => {
      return ItemEvent.create(message);
    })
    .then(() => {
      return eventHandler.publish(topic.addedItem, message);
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
 * Mark the item isDeleted.
 *
 */
function deleteItem(req, res) {
  const itemId = req.swagger.params.itemId.value;

  Util.checkObjectId(itemId)
    .then(() => {
      return Item.findOneAndUpdate({ _id: itemId }, { isDeleted: true }, { new: true }).exec();
    })
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
function updateItem(req, res) {
  const itemId = req.swagger.params.itemId.value;
  const item = req.swagger.params.Item.value;
  item.lname = item.name.toLowerCase();
  const update = Object.assign(item, { $currentDate: { lastUpdated: true } });

  Util.checkObjectId(itemId)
    .then(() => {
      return Item.findOneAndUpdate({ _id: itemId }, update, { new: true }).exec();
    })
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

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
function isDeletedItem(req, res) {
  const itemId = req.swagger.params.itemId.value;
  const item = req.swagger.params.Item.value;
  const update = Object.assign(item, { $currentDate: { lastUpdated: true } });

  Util.checkObjectId(itemId)
    .then(() => {
      return Item.findOneAndUpdate({ _id: itemId }, update, { new: true }).exec();
    })
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



/**
 * Check Price validation info of the item.
 * @param {*} req
 * @param {*} res
 */
function validateItem(req, res) {
  const itemId = req.swagger.params.itemId.value;
  const orderedItemData = req.swagger.params.ValidateItem.value;
  const orderedPrice = orderedItemData.payload.price;
  const orderedQuantity = orderedItemData.payload.quantity;
  const createdDateOfItem = new Date(orderedItemData.createdDate).toISOString();

    /**
     * No matter the item is valid or not, it's always valid
     * because customer just would like to remove this item with
     * orderedQuantity === 0 so that the aggegrator will remove it from an order.
     *
     * TODO:we should process this case before any checking functions.
     */
  Util.checkObjectId(itemId)
    .then(() => {
      return findItem(itemId);
    })
    .then((item) => {
      // Not found
      if (!item) {
        const message = {
          code: 400,
          message: 'Item is not found',
          itemId,
          price: orderedPrice,
          quantity: orderedQuantity,
          itemInfo: orderedItemData
        };
        res.json(message);
      }
      return Promise.resolve(item);
    })
    .then(item => { return checkItemPrice(item, orderedPrice, createdDateOfItem); })
    .then(({ code, result, item }) => {
      const message = {
        code: orderedQuantity === 0 ? 0 : code,
        message: result,
        itemId: item._id,
        price: orderedPrice,
        quantity: orderedQuantity,
        itemInfo: item
      };
      res.json(message);
    })
    .catch((err) => {
      const resErr = { code: err.code, message: err.message };
      console.log(resErr);
      res.status(err.code).json(resErr);
    });
}

/**
 *
 * @param {*} itemId
 */
function findItem(itemId) {
  return Item.findOne({ _id: itemId }).exec();
}

/**
 *
 * @param {*} item
 * @param {*} orderedPrice
 * @param {*} createdDateOfItem
 */
function checkItemPrice(item, orderedPrice, createdDateOfItem) {
  return new Promise((resolve, reject) => {
    const itemPrice = item.price.price;
    const itemSalePrice = item.price.sale.salePrice;
    const itemSaleEndDate = new Date(item.price.sale.saleEndDate).toISOString();

    if (itemPrice !== orderedPrice) {
      if (itemSaleEndDate < createdDateOfItem) {
        return resolve({ code: 100, result: 'Price is invalid', item });
      } else if (itemSalePrice !== orderedPrice) {
        return resolve({ code: 100, result: 'Price is invalid', item });
      }
      return resolve({ code: 0, result: 'Price is valid', item });
    }
    resolve({ code: 0, result: 'Price is valid', item });
  });
}
