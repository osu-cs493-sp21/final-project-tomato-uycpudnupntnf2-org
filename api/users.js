const { getUserByEmail, getUserById, deleteUser, getUserComments, updateUser, getUserVideos, subUser, unsubUser } = require('../db/dbCall');
const { generateAuthToken, requireAuthentication, checkUser } = require('../lib/auth');
const { userschema, validateSchema } = require('../lib/validation');
const { insertNewUser, validateUser } = require('../models/user');

const router = require('express').Router();
// Get user by user id
// Post user by user id
// Delete user by user id
// Get subscriptions by user id
// Get user comments by user id
// Put user comments by user id
// Subscribe to user


/*
 * Insert a new User into the DB.
 */
router.post('/',  async (req, res, next) => {
    if(validateSchema(req.body, userschema)){
      try{
        const id = await insertNewUser(req.body)
        res.status(200).send({ id: id });
      } catch (err) {
        console.error(err);
        res.status(500).send({
          error: "Unable to insert user. Please try again later."
        });
      }
    } else {
      res.status(400).send({
        error: "Request body is not a valid user object."
      });
    }
  });
  
router.post('/login', async (req, res, next) => {
    if (req.body && req.body.email && req.body.pass) {
      try {
        //Changed validate user to only pass back a true false
        //Then if it passes we get the user again to pass back a token.
        const authenticated = await validateUser(req.body.email, req.body.pass);
        if (authenticated) {
          const user = await getUserByEmail(req.body.email);
          res.status(200).send({
            token: generateAuthToken(user._id)
          });
        } else {
          res.status(401).send({
            error: "Invalid authentication credentials."
          });
        }
      } catch (err) {
        console.error("  -- error:", err);
        res.status(500).send({
          error: "Error logging in.  Try again later."
        });
      }
    } else {
      res.status(400).send({
        error: "Request body needs `email` and `pass`."
      });
    }
  });

  router.put('/:id', requireAuthentication, checkUser, async (req, res, next) => {

    if(validateSchema(req.body, userschema)){
    try {
      const user = await updateUser(req.params.id, req.body);
      if (user) {
        res.status(204).end()
      } else {
        next();
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({
        error: "Unable to fetch the user.  Please try again later."
      });
    }
  } else {
    res.status(400).send({
      error: "Request needs to be a user object."
    });
  }
  })

  router.get('/:id', requireAuthentication, checkUser, async (req, res, next) => {
    try {
      console.log(req.params.id)
      var user = await getUserById(req.params.id);
      delete user.pass
      if (user) {
        res.status(200).send({ user: user });
      } else {
        next();
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({
        error: "Unable to fetch the user.  Please try again later."
      });
    }
  })

  router.delete('/:id', requireAuthentication, checkUser, async (req, res, next) => {
    try {
      const user = await deleteUser(req.params.id);
      if (user) {
        res.status(204).end()
      } else {
        next();
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({
        error: "Unable to fetch the user.  Please try again later."
      });
    }
  })

  router.get('/:id/subscriptions', requireAuthentication, checkUser, async (req, res, next) => {
    try {
      const user = await getUserById(req.params.id);
      if (user) {
        res.status(200).send({ subscriptions: user.subs });
      } else {
        next();
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({
        error: "Unable to fetch the user.  Please try again later."
      });
    }
  })

  router.get('/:id/comments', requireAuthentication, checkUser, async (req, res, next) => {
    try {
      const user = await getUserComments(req.params.id);
      if (user) {
        res.status(200).send({ user: user });
      } else {
        next();
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({
        error: "Unable to fetch the user.  Please try again later."
      });
    }
  })
  router.get('/:id/videos', requireAuthentication, checkUser, async (req, res, next) => {
    try {
      const user = await getUserVideos(req.params.id);
      if (user) {
        res.status(200).send({ userVids: user.vids });
      } else {
        next();
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({
        error: "Unable to fetch the user.  Please try again later."
      });
    }
  })

  //Need to check if the subid exists
  router.post('/:id/subscribe/:subid', requireAuthentication, checkUser, async (req, res, next) => {
    try {
      const user = await getUserById(req.params.id);
      const subuser = await getUserById(req.params.subid);
      if(!subuser){ 
        res.status(500).send({
          error: "The user you want to subscribe to does not exist."
        });
      }
      if (user) {
        const result = await subUser(req.params.id, req.params.subid);
        res.status(204).end();
      } else {
        next();
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({
        error: "Unable to fetch the user.  Please try again later."
      });
    }
  })

  router.post('/:id/unsubscribe/:subid', requireAuthentication, checkUser, async (req, res, next) => {
    try {
      const user = await getUserById(req.params.id);
      const subuser = await getUserById(req.params.subid);
      if(!subuser){ 
        res.status(500).send({
          error: "The user you want to subscribe to does not exist."
        });
      }
      if (user) {
        const result = await unsubUser(req.params.id, req.params.subid);
        res.status(204).end();
      } else {
        next();
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({
        error: "Unable to fetch the user.  Please try again later."
      });
    }
  })
  
  
module.exports = router;
