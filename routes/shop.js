const express = require('express');

const shopController = require('../controllers/shop');
const isAuth = require('../middleware/is-auth');
const isCandidate = require('../middleware/is-candidate');

const router = express.Router();

router.get('/', shopController.getIndex);
router.get('/products',isCandidate, shopController.getProducts);

router.get('/cart', isAuth,isCandidate, shopController.getCart);

router.post('/cart', isAuth,isCandidate, shopController.postCart);

router.post('/cart-delete-item', isAuth,isCandidate, shopController.postCartDeleteProduct);
router.post('/reject-delete-item', isAuth,isCandidate, shopController.postRejectDelete);

router.get('/rejected', isAuth,isCandidate, shopController.getRejected);
router.post('/rejected', isAuth,isCandidate, shopController.postReject);

module.exports = router;
