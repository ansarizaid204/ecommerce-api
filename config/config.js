require("dotenv").config(); // this is important!
module.exports = {
  database: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    name: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    mongo_url:process.env.MONGO_URL

  },

  mail: {
    mailer: process.env.SMTP_MAILER,
    sender: process.env.SMTP_SENDER,
    sender_name: process.env.SMTP_SENDER_NAME,
    reciever: process.env.SMTP_RECIEVER,
    reciever_cc: process.env.SMTP_RECIEVER_CC,
    reciever_bcc: process.env.SMTP_RECIEVER_BCC,
    
    host: process.env.SMTP_HOST,
    username: process.env.SMTP_USER,
    password: process.env.SMTP_PASS,
    port: process.env.SMTP_PORT,
    ssl: process.env.SMTP_ENCRYPT,
    sendgrid_api_key: process.env.SENDGRID_API_KEY,
    service: process.env.SMTP_SERVICE,
  },
  secretkey: process.env.JWT_SECRET,
  session_secretkey: process.env.SESSION_SECRET,
  recaptcha_site_key: process.env.RECAPTCHA_SITE_KEY,
  recaptcha_secret_key: process.env.RECAPTCHA_SECRET_KEY,
  base_url: process.env.BASE_URL,
  app_mode: process.env.APP_MODE,
  app_port: process.env.PORT,

  jwt_expire_time: process.env.JWT_EXPIRE_TIME,
  messages: {
    delete_confirm: "",
  },
  azure: {
    accountName: process.env.AZURE_ACCOUNT_NAME,
    accountKey: process.env.AZURE_ACCOUNT_KEY,
    containerName: process.env.AZURE_CONTAINER_NAME,
  },
  aws: {
    accessKey: process.env.AWS_ACCESS_KEY,
    secretKey: process.env.AWS_SECRET_KEY,
    bucketName: process.env.AWS_BUCKET_NAME,
    region: process.env.AWS_REGION,
    s3BaseUrl: process.env.AWS_S3_BASE_URL,
  },
  auth: {
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
    accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m',
    refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '30d',
    cookieDomain: process.env.COOKIE_DOMAIN,
    cookieSecure: process.env.COOKIE_SECURE,

    googleClientId:process.env.GOOGLE_CLIENT_ID,
    googleClientSecret:process.env.GOOGLE_CLIENT_SECRET,
    googleRedirectUrl:process.env.GOOGLE_REDIRECT_URI
  },
};
