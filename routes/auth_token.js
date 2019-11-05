const jwt = require('jsonwebtoken');
const User = require('../schema/user');
// module.exports = (req,res,next)=>{
//     jwt.verify(token, 'shhhhh', function(err, decoded) {
//         console.log(decoded.foo) // bar
//       });
// console.log("Authorized");
// next();
// }

module.exports = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const tokenKey = token.replace("Bearer ", "");
        const decoded = jwt.verify(tokenKey, "thisismysecretkey");
        const objectId = req.headers.object_id;
        const user = await User.findById({ _id: objectId, "tokens.token": token });
        if (!user) {
            res.status(401).json({ "err": "Technical error" })

        }
        if (user) {
            req.user = user;
            next();
        }

    }
    catch (err) {
        res.status(401).json({ "err": "Un-Authenticate user" })
    }
}