const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session); 
const csrf = require('csurf');
const flash = require('connect-flash');
const Employer = require('./models/employer');

const errorController = require('./controllers/error'); 
const User = require('./models/user');
const port = process.env.PORT || 3000;

const MONGODB_URI = process.env.MONGO_DB_URI ||
  'mongodb+srv://mongo:mongo@cluster0.sx44x.mongodb.net/shop?retryWrites=true&w=majority';

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});
const csrfProtection = csrf();


app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn; 
  res.locals.csrfToken = req.csrfToken();
  if(req.session.user){
    res.locals.userType = req.session.user.userType;
    return next();
  }
  res.locals.userType = 0;
  // console.log(res.locals);
  return next();
});

app.use((req, res, next) => {
  // throw new Error('Sync Dummy');
  if (!req.session.user) {
    // console.log('here');
    return next();
  }
  let Model = User;
  // console.log(req.session.user.userType);
  if(req.session.user.userType == 'employer'){
    Model = Employer;
  }
  Model.findById(req.session.user._id)
    .then(user => {
      if (!user) {
        return next();
      }
      // console.log('found');
      req.user = user;
      return next();
    })
    .catch(err => {
      // console.log('here');
      next(new Error(err));
    });
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500', errorController.get500);

app.use(errorController.get404);

app.use((error, req, res, next) => {
  // res.redirect('/500');
  // console.log(error);
  res.status(500).render('500', {
    pageTitle: 'Error!',
    path: '/500',
    isAuthenticated: req.session.isLoggedIn
  });
});

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true,  useFindAndModify: false  })
  .then(result => {
    app.listen(port);
  })
  .catch(err => {
    console.log(err);
    console.log('here');
  });
