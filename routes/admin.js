const express = require('express');
const { body } = require('express-validator');

const adminController = require('../controllers/admin');
const isAdmin = require('../middleware/is-employer');
const isAuth = require('../middleware/is-auth');
const router = express.Router();

router.get('/products',isAuth, isAdmin, adminController.getProducts); 

router.get('/addjob',isAuth,isAdmin, adminController.getJob);

router.post(
  '/addjob',
  [
      body('title')
        .isString()
        .isLength({ min: 3 })
        .trim(),
      body('price').isFloat(),
      body('description')
        .isLength({ min: 5, max: 400 })
        .trim(),
      body('location').isString()
    ],
    isAdmin,
    adminController.postJob
  );

router.get('/edit-product/:productId', isAuth,isAdmin, adminController.getEditProduct);

router.post(
  '/edit-product',
  [
    body('title')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body('price').isFloat(),
    body('description')
      .isLength({ min: 5, max: 400 })
      .trim()
  ],
  isAdmin,
  adminController.postEditProduct
);

router.post('/delete-product', isAuth,isAdmin, adminController.postDeleteProduct);
router.get('/dashboard',isAuth,isAdmin, adminController.getDashboard);

module.exports = router;
