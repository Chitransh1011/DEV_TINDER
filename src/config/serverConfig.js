const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET:process.env.JWT_SECRET,
    SMTP_USERNAME:process.env.SMTP_USERNAME,
    SMTP_PASSWORD:process.env.SMTP_PASSWORD,
    FROM_EMAIL:process.env.FROM_EMAIL,
    APP_PASSWORD:process.env.APP_PASSWORD
}