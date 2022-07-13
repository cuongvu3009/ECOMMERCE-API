const express = require('express');
const router = express.Router();

const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  deleteProduct,
  updateProduct,
  uploadImage,
} = require('../controllers/productController');

const {
  authenticateUser,
  authorizedPermission,
} = require('../middleware/authentication');

router
  .route('/')
  .get(getAllProducts)
  .post([authenticateUser, authorizedPermission], createProduct);
router
  .route('/:id')
  .get(getSingleProduct)
  .patch([authenticateUser, authorizedPermission], updateProduct)
  .delete([authenticateUser, authorizedPermission], deleteProduct);
router
  .route('/uploadImage')
  .post([authenticateUser, authorizedPermission], uploadImage);

module.exports = router;
