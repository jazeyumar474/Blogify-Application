const JWT = require('jsonwebtoken');
const secretKey = "90577efe@786$123#%";
function createTokenForUser(user){
    const payLoad = {
        _id : user._id,
        email : user.email,
        profileImageUrl : user.profileImageUrl || "/images/userDefault.png",
        role: user.role,
    };
    const token = JWT.sign(payLoad, secretKey);
    return token;
}
function validateToken(token) {
    const payLoad = JWT.verify(token, secretKey);
    return payLoad;
}
module.exports = {
    createTokenForUser,
    validateToken,
};