<<<<<<< HEAD
# test
website with angular 5
=======
This service will replace the product-catalog service.

# For testing
$ DB_URL=mongodb://dh-services:dh123@manager.fideli-sys.com:27017/dh-services \
swagger project start -m

Flow:
=====
catalog --[addedSubCategory]----> catalog-worker.addedSubCategory()
          [movedCategory]-------> catalog-worker.movedcategory()
          [deletedCategory]-----> catalog-worker.deletedCategory()
          [addedItem]-----------> catalog-worker.addeditem()
          [addedCombo]----------> catalog-worker.addedcombo()

>>>>>>> heloo
