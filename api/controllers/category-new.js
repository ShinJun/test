'use strict';

//const mongoose = require('mongoose');
const EventHandler = require('../../libs/event-handler');
const Category = require('../models/catagory-new');
const CategoryEvent = require('../models/category-event');

module.exports = {
  addCategory1,
  addSubCategory,
  updateCategory,
  deleteCategory,
  moveCategory
};
/**
 * Add a new root category.
 *
 */
function addCategory1(req, res) {
  const category = new Category(req.swagger.params.Category.value);
  category.restaurantId = req.swagger.params.restaurantId.value;
  console.log(category);
  category.lname = category.name.toLowerCase();
  category.save()
    .then(() => {
      res.json({
        categoryId: category._id,
        message: 'Success'
      });
    })
    .catch((err) => {
      console.log(`err: ${err}`);
      res.status(500).json({
        code: 100,
        message: 'Internal Server Error'
      });
    });
}
/**
 * Add a new sub category.
 * Pub a message so that a worker can sub to it in order to build the its categoryPath.
 */
function addSubCategory(req, res) {
  const category = new Category(req.swagger.params.Category.value);
  category.restaurantId = req.swagger.params.restaurantId.value;
  category.parentId = req.swagger.params.parentId.value;
  category.lname = category.name.toLowerCase();

  const message = {
    categoryId: category._id,
    restaurantId: req.swagger.params.restaurantId.value,
    event: 'addedSubCategory',
    // TODO: - the api-gateway will inject it into headers when redirecting to this service.
    userId: '',
    payload: { parentId: category.parentId }
  };
  category.save()
    .then(() => {
      return CategoryEvent.create(message);
    })
    .then(() => {
      const eventHandler = new EventHandler();
      return eventHandler.publish(eventHandler.topic.addedSubCategory, message);
    })
    .then(() => {
      res.json({
        categoryId: category._id,
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
 * Update category.
 *
 * TODO: Should impletment JSON validator instead of just deleteing unwanted fields
 * for updating.
 */
function updateCategory(req, res) {
  const categoryId = req.swagger.params.categoryId.value;
  const category = req.swagger.params.Category.value;

  delete category._id;
  delete category.restaurantId;
  delete category.parentId;
  delete category.path;
  const update = Object.assign(category, { $currentDate: { lastUpdated: true } });

  Category.findOneAndUpdate({ _id: categoryId }, update, { new: true }).exec()
    .then((doc) => {
      console.log(doc);
      res.json({
        categoryId,
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
 * Mark a category as isDeleted, but do not delete its items.
 * Pub a message so that a worker can sub in order to remove categoryPath from its items.
 */
function deleteCategory(req, res) {
  const categoryId = req.swagger.params.categoryId.value;
  const message = {
    categoryId,
    restaurantId: req.swagger.params.restaurantId.value,
    event: 'deletedCategory',
    // TODO: - the api-gateway will inject it into headers when redirecting to this service.
    userId: '',
    payload: { }
  };
  Category.findOneAndUpdate({ _id: categoryId }, { isDeleted: true }, { new: true }).exec()
    .then(() => {
      return CategoryEvent.create(message);
    })
    .then(() => {
      const eventHandler = new EventHandler();
      return eventHandler.publish(eventHandler.topic.deletedCategory, message);
    })
    .then((doc) => {
      console.log(doc);
      res.json({
        categoryId,
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
 * Mark a category as isDeleted, but do not delete its items.
 * Pub a message so that a worker can sub to it. And a worker will update categoryPath
 * from its sub cats and items also.
 */
function moveCategory(req, res) {
  const categoryId = req.swagger.params.categoryId.value;
  const parentId = req.swagger.params.MoveToCategory.value.parentId;
  const message = {
    categoryId,
    restaurantId: req.swagger.params.restaurantId.value,
    event: 'movedCategory',
    // TODO: - the api-gateway will inject it when redirecting to order service.
    userId: '',
    payload: { parentId }
  };
  Category.findOneAndUpdate({ _id: categoryId }, { parentId }, { new: true }).exec()
    .then(() => {
      return CategoryEvent.create(message);
    })
    .then(() => {
      const eventHandler = new EventHandler();
      return eventHandler.publish(eventHandler.topic.movedCategory, message);
    })
    .then((doc) => {
      console.log(doc);
      res.json({
        categoryId,
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
