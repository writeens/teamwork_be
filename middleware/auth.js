// Import JWT
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try{
        // Get token from Authorization
        const token = req.headers.authorization.split(' ')[1];
        // Decode Token
        jwt.verify(token, 'TEAMWORK', (err, decoded) => {
            if (err) {
            return res.status(401).json({
                status: 'error',
                message: 'Unable to verify user',
            });
            }
            req.decoded = decoded;
            next();
        });
    } catch {
        res.status(401).json({
            status:"error",
            message:"Invalid authorization, Check token"
        });
    }
};

