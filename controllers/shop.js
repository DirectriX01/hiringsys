const Product = require('../models/product');
const ITEMS_PER_PAGE = 8;

exports.getProducts = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;
  Product.find({status : 'Live'})
    // .then(products => {
    //   console.log(products[0].status); 
    //   res.render('shop/product-list', {
    //     prods: products,
    //     pageTitle: 'All Products',
    //     path: '/products'
    //   });
    // })
    // .catch(err => {
    //   const error = new Error(err);
    //   error.httpStatusCode = 500;
    //   return next(error);
    // });
       .countDocuments()
      .then(numProducts => {
        totalItems = numProducts;
        return Product.find({status : 'Live'})
          .skip((page - 1) * ITEMS_PER_PAGE)
          .limit(ITEMS_PER_PAGE);
      })
      .then(products => {
        res.render('shop/product-list', {
          prods: products,
          pageTitle: 'Live Products',
          path: '/shop/product-list',
          currentPage: page,
          hasNextPage: ITEMS_PER_PAGE * page < totalItems,
          hasPreviousPage: page > 1,
          nextPage: page + 1,
          previousPage: page - 1,
          lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
        });
      })
        .catch(err => {
          const error = new Error(err);
          error.httpStatusCode = 500;
          return next(error);
        });
};

exports.getIndex = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;
  Product.find()
    // .then(products => {
    //   // console.log(req);
    //   res.render('shop/index', {
    //     prods: products,
    //     pageTitle: 'Shop',
    //     path: '/'
    //   });
    // })
    // .catch(err => {
    //   const error = new Error(err);
    //   error.httpStatusCode = 500;
    //   return next(error);
    // });
          .countDocuments()
      .then(numProducts => {
        totalItems = numProducts;
        return Product.find()
          .skip((page - 1) * ITEMS_PER_PAGE)
          .limit(ITEMS_PER_PAGE);
      })
      .then(products => {
        res.render('shop/index', {
          prods: products,
          pageTitle: 'All Jobs',
          path: 'shop/index',
          currentPage: page,
          hasNextPage: ITEMS_PER_PAGE * page < totalItems,
          hasPreviousPage: page > 1,
          nextPage: page + 1,
          previousPage: page - 1,
          lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
        });
      })
        .catch(err => {
          const error = new Error(err);
          error.httpStatusCode = 500;
          return next(error);
        });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items;
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postCart = (req, res, next) => {
  let toBeproduct;
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      toBeproduct = product;
      return req.user.addToCart(product);
    })
    .then(_ => {
      toBeproduct.status = 'Accepted';
      toBeproduct
        .save()
        .then((result) => {
          // console.log(result);
          res.redirect("/cart");
        })
        .catch((err) => {
          // console.log(err);
          res.redirect("/");
        });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then(result => {
      Product.findByIdAndUpdate(prodId, { status: 'Live'},function (err, docs) {
        if (err){
            // console.log(err);
        }});
      res.redirect('/cart');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};


exports.getRejected = (req, res, next) => {
  req.user
    .populate('rejected.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.rejected.items;
      res.render('shop/rejected', {
        path: '/rejected',
        pageTitle: 'Your Cart',
        products: products
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};


exports.postReject = (req, res, next) => {
  let toBeproduct;
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      toBeproduct = product;
      toBeproduct.status = 'Rejected';
      return req.user.addToReject(product);
    })
    .then(_ => {
      toBeproduct
        .save()
        .then((result) => {
          // console.log(result);
          res.redirect("/rejected");
        })
        .catch((err) => {
          // console.log(err);
          res.redirect("/");
        });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postRejectDelete = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromReject(prodId)
    .then(result => {
      Product.findByIdAndUpdate(prodId, { status: 'Live'},function (err, docs) {
        if (err){
            // console.log(err);
        }});
      res.redirect('/rejected');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};