const { extractValidFields, userschema } = require('../lib/validation');
const bcrypt = require('bcryptjs');
const { insertUser, getUserByEmail } = require('../db/dbCall');

/*
 * Insert a new User into the DB.
 */
exports.insertNewUser = async function (user) {
    const userToInsert = extractValidFields(user, userschema);
    console.log("  -- userToInsert before hashing:", userToInsert);
    userToInsert.pass = await bcrypt.hash(userToInsert.pass, 8);
    console.log("  -- userToInsert after hashing:", userToInsert);
    const id = await insertUser(userToInsert)
    return id;
  };

  async function validateUser (email, password) {
    const user = await getUserByEmail(email);
    return await bcrypt.compare(password, user.pass);
  }
exports.validateUser = validateUser;
