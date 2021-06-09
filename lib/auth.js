const jwt = require('jsonwebtoken');
const secretKey = "untitled_youtube_clone_project_unfinishedDoNotUse_PleaseNotThisName_FINAL (2) - copy.org";

function generateAuthToken(userid) {
    const payload = { sub: userid };
    return jwt.sign(payload, secretKey, { expiresIn: '24h' });
}
exports.generateAuthToken = generateAuthToken

function requireAuthentication(req, res, next) {
    console.log("  -- verifying authentication");
    const authHeader = req.get('Authorization') || '';
    const authHeaderParts = authHeader.split(' ');
    console.log("  -- authHeaderParts:", authHeaderParts);
    const token = authHeaderParts[0] === 'Bearer' ? authHeaderParts[1] : null;
  
    try {
      const payload = jwt.verify(token, secretKey);
      req.user = payload.sub;

      next();
    } catch (err) {
      res.status(401).send({
        error: "Invalid authentication token."
      });
    }
  }
  exports.requireAuthentication = requireAuthentication;

  //Check if the User matches the passed in id through parameters
  //Req.user comes from require Authentication.
  //THIS FUNCTION IS ONLY EVER CALLED AFTER requireAuthentication
  async function checkUser(req, res, next) {
      if(parseInt(req.params.id) === parseInt(req.user)){
          next()
      }
      else{
        res.status(401).send({
            error: "User does not match authentication token.."
          });
      }
  }
exports.checkUser = checkUser;

  //Check if the User matches the passed in id through the body
  //Req.user comes from require Authentication.
  //THIS FUNCTION IS ONLY EVER CALLED AFTER requireAuthentication
  async function checkUserFromBody(req, res, next) {
    console.log(req.body)
    if(!req.body._id){
        return res.status(400).send({
            error: "Request body needs an `_id`."
          });
    }
    if(parseInt(req.body._id) === parseInt(req.user)){
        next()
    }
    else{
      res.status(401).send({
          error: "User does not match authentication token.."
        });
    }
}
exports.checkUserFromBody = checkUserFromBody;


