const Product = require('../models/Product');
const CustomError = require('../errors');
const path = require('path');

const createProduct = async (req, res) => {
  req.body.user = req.user.userId;
  const product = await Product.create(req.body);
  res.status(201).json({ product });
};

const getAllProducts = async (req, res) => {
  const products = await Product.find({});
  res.status(200).json({ products, counts: products.length });
};

const getSingleProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOne({ _id: productId }).populate('reviews');
  if (!product) {
    throw new CustomError.NotFoundError(`No product with id ${productId}`);
  }
  res.status(200).json({ product });
};

const updateProduct = async (req, res) => {
  const { id: productId } = req.params;

  const product = await Product.findOneAndUpdate({ _id: productId }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    throw new CustomError.NotFoundError(`No product with id ${productId}`);
  }
  res.status(200).json({ product });
};

const deleteProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOne({ _id: productId });
  if (!product) {
    throw new CustomError.NotFoundError(`No product with id ${productId}`);
  }
  await product.remove();
  res.status(200).json({ msg: 'Success, product removed!' });
};

const uploadImage = async (req, res) => {
  console.log(req.files);
  //	if image exist
  if (!req.files) {
    throw new CustomError.BadRequestError('Please provide image');
  }
  //	if it is image
  const productImage = req.files.image;
  if (!productImage.mimetype.startsWith('image')) {
    throw new CustomError.BadRequestError('You can only upload image');
  }
  //	image size constraint
  const maxSize = 1024 * 1024;
  if (!productImage.size > maxSize) {
    throw new CustomError.BadRequestError(
      'Please upload smaller size image (smaller than 1MB)'
    );
  }
  const imagePath = path.join(
    __dirname,
    '../public/uploads/' + `${productImage.name}`
  );
  await productImage.mv(imagePath);
  res.status(201).json({ image: `/uploads/${productImage.name}` });
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
};
