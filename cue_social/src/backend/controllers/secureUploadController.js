const crypto = require('crypto');
const uuid = require('uuid');

const generateAuthenticationParams = () => {
    const token = uuid.v4();
    const expire = Math.floor(Date.now() / 1000) + 2400; // Example expiration time
    const privateAPIKey = process.env.IMAGEKIT_SK; // Fetch private API key from environment variables

    const signature = crypto.createHmac('sha1', privateAPIKey)
                            .update(token + expire.toString())
                            .digest('hex');

    return {
        token: token,
        expire: expire,
        signature: signature
    };
};

module.exports = {
    generateAuthenticationParams,
};
