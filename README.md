# E-Commerce Backend API

A robust, backend-only e-commerce system built with Node.js, Express, and MongoDB. This API supports custom Google Authentication (OAuth2), product management with AWS S3 image storage, and a secure purchasing flow.

## 🚀 Features

* **Custom Authentication:** Zero-dependency Google OAuth2 implementation with Session/Refresh Token management.
* **Product Management:** AWS S3 integration for multi-image uploads
* **Order System:** Secure server-side price calculation and historical data snapshotting.
* **Input Validation:** Strict data validation using Joi.
* **Email Notifications:** Async order confirmations using Nodemailer/SMTP.

## 🛠️ Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB (Mongoose)
* **Storage:** AWS S3 (AWS SDK v3)
* **Validation:** Joi
* **Email:** Nodemailer

---

## ⚙️ Installation & Setup

### 1. Prerequisites
* Node.js (v18+)
* MongoDB (Local or Atlas)
* AWS S3 Bucket
* Google Cloud Console Project (OAuth2 Credentials)

### 2. Clone Repository
```bash
git clone https://github.com/ansarizaid204/ecommerce-api.git
cd ecommerce-api
```
### 3\. Install Dependencies

```bash
npm install
```

### 4\. Environment Configuration

Create a `.env` file in the root directory and configure the following variables:

```bash
# =============APPLICATION==================
APP_MODE=development # development, production

# ============DATABASE=====================
MONGO_URL="mongodb://localhost:27017/your_database_name"

# =============SMTP===========================

SMTP_MAILER=on
SMTP_SENDER=no-reply@example.com
SMTP_SENDER_NAME="Ecommerce"
SMTP_RECIEVER=admin@example.com
SMTP_RECIEVER_CC=
SMTP_RECIEVER_BCC=

SMTP_HOST=smtp.gmail.com
SMTP_USER=your_email@example.com
SMTP_PASS=your_email_app_password
SMTP_PORT=587
SMTP_ENCRYPT=true

# =============AWS S3 STORAGE===========================
AWS_ACCESS_KEY=your_aws_access_key
AWS_SECRET_KEY=your_aws_secret_key
AWS_BUCKET_NAME=your_s3_bucket_name
AWS_REGION=ap-south-1
AWS_S3_BASE_URL=https://your-bucket-name.s3.region.amazonaws.com

# =============AUTHENTICATION===========================
ACCESS_TOKEN_SECRET=your_super_secure_access_token_secret
REFRESH_TOKEN_SECRET=your_super_secure_refresh_token_secret
ACCESS_TOKEN_EXPIRES_IN=10m
REFRESH_TOKEN_EXPIRES_IN=30d
COOKIE_DOMAIN=localhost
COOKIE_SECURE=false

# =============GOOGLE AUTH===========================
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:4000/auth/google-callback
```

### 5\. Run the Server

```bash
# Development Mode (Nodemon)
npm run dev

# Production Mode
npm start
```

-----

## 📚 API Documentation

### **Authentication**

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/auth/google` | Redirects to Google Login (Browser only). |
| `GET` | `/auth/google-callback` | Handles Google redirect and returns Access Token. |
| `GET` | `/account/profile` | **[Auth]** Get logged-in user details. |

#### 🛑 **How to Test Login (Important)**

Since there is no UI, follow these steps:

1.  Open your browser and visit: `http://localhost:3000/auth/google`
2.  Login with your Google account.
3.  Upon success, the browser will display a JSON response with your `accessToken`.
4.  Copy this token and use it in Postman Headers: `Authorization: Bearer <your_token>`.

-----

### **Products**

| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/products` | List all products with S3 Image URLs. | Public |
| `GET` | `/products/:id` | Get single product details. | Public |

-----

### **Orders**

| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `POST` | `/orders/checkout` | Place a new order. | **Required** |
| `GET` | `/account/orders` | View order history. | **Required** |

**Checkout Payload Example:**

```json
{
    "items": [
        { "productId": "6571a6e9f05a9c2b4d123456", "quantity": 1 },
        { "productId": "6571a6e9f05a9c2b4d987654", "quantity": 2 }
    ]
}
```

-----

### **Admin**

| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `POST` | `/admin/products` | Create product . | **Required** |
| `POST` | `/admin/products/categories` | Create new category. | **Required** |
| `GET` | `/admin/products/categories` | List all categories. | **Required** |

**Create Product (Multipart/Form-Data):**

  * `title`: Text
  * `description`: Text
  * `price`: Number
  * `category`: CategoryID
  * `images`: File (Max 5 files)

-----

## 🧪 Postman Collection

A complete Postman collection is included in the root directory: `Ecommerce-api.postman_collection.json`.

1.  Open Postman.
2.  Import -\> Select the file.
3.  Set the `base_url` variable to `http://localhost:4000`.



