
# REST API Documentation

  

## Introduction

This REST API provides endpoints for user registration, login, logout, text correction, and PDF handling.

  

## Endpoints

  

### 1. User Registration

  

#### Endpoint

`/register`

  

#### Method

`POST`

  

#### Parameters

-  `name` (string): Nama pengguna.

-  `email` (string): Alamat email pengguna.

-  `password` (string): Kata sandi pengguna.

  

#### Response

-  `201 Created`: Pengguna berhasil dibuat.

-  `400 Bad Request`: Input tidak valid.

  

#### Example Request

```json

{

"name":  "John Doe",

"email":  "johndoe@example.com",

"password":  "securepassword123"

}

```

### 2. User Login

  

#### Endpoint

  

`/login`

  

#### Method

  

`POST`

  

#### Parameters

  

-  `email` (string): Alamat email pengguna.

-  `password` (string): Kata sandi pengguna.

  

#### Response

  

-  `200 OK`: Login berhasil.

-  `403 Forbidden`: Kata sandi salah.

-  `404 Not Found`: Pengguna tidak ditemukan.

  

#### Example Request

  

```json

{

"email":  "johndoe@example.com",

"password":  "securepassword123"

}

```

  

#### Example Response

  
  

```json

{

"data":  {

"id":  "johndoe@example.com",

"name":  "John Doe",

"address":  "-"

},

"token":  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

}

```

  

### 3. User Logout

  

#### Endpoint

  

`/logout`

  

#### Method

  

`POST`

  

#### Parameters

  

-  `Authorization` (header): Bearer token JWT.

  

#### Response

  

-  `200 OK`: Logout berhasil.

-  `403 Forbidden`: Token tidak valid.

  

#### Example Request

  
  

```bash

POST  /logout

Authorization:  Bearer  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

```

  

#### Example Response

  
  

```json

{

"message":  "Logout successful"

}

```

  
  
  
  

### 4. Text Correction

  

#### Endpoint

  

`/text/correct`

  

#### Method

  

`POST`

  

#### Parameters

  

-  `text` (string): Teks yang akan dikoreksi.

-  `Authorization` (header): Bearer token JWT.

  

#### Response

  

-  `200 OK`: Teks yang telah dikoreksi.

  

#### Example Request

  
  

```json

{

"text":  "This is an exampel of incorret text."

}

```

  

#### Example Response

  
  
  

```json

{

"correctedText":  "This is an example of incorrect text."

}

```

  

### 5. PDF Upload and Correction

  

#### Endpoint

  

`/pdf/upload`

  

#### Method

  

`POST`

  

#### Parameters

  

-  `file` (file): PDF file yang akan diupload.

-  `Authorization` (header): Bearer token JWT.

  

#### Response

  

-  `200 OK`: PDF file berhasil diupload dan dikoreksi.

-  `400 Bad Request`: File tidak valid.

  

#### Example Request

  
  
  

`POST /pdf/upload

Content-Type: multipart/form-data

Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

  

### 6. Google OAuth Sign-In

  

#### Endpoint

  

`/auth/google`

  

#### Method

  

`GET`

  

#### Parameters

  

None

  

#### Response

  

-  `302 Found`: Redirects to Google OAuth consent screen.

  

#### Example Request

  

`GET /auth/google`

  

#### Example Response

  

```http

  

HTTP/1.1 302 Found

Location: https://accounts.google.com/o/oauth2/auth?client_id=...`

```

### 7. Google OAuth Callback

  

#### Endpoint

  

`/auth/google/callback`

  

#### Method

  

`GET`

  

#### Parameters

  

-  `code` (string): Authorization code returned from Google.

  

#### Response

  

-  `200 OK`: OAuth authentication successful, user information returned.

-  `500 Internal Server Error`: An error occurred during the OAuth process.

  

#### Example Request

  

http

  

Copy code

  

`GET /auth/google/callback?code=4/P7q7W91a-oMsCeLvIaQm6bTrgtp7`

  

#### Example Response

  
  
  

```json

{

"data":  {

"email":  "johndoe@example.com",

"name":  "John Doe",

"address":  "-"

},

"token":  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

}
```
### 8. PDF Upload and Correction

#### Endpoint

`/pdf/upload`

#### Method

`POST`

#### Parameters

-   `file` (file): PDF file yang akan diupload.
-   `Authorization` (header): Bearer token JWT.

#### Response

-   `200 OK`: PDF file berhasil diupload dan dikoreksi.
-   `400 Bad Request`: File tidak valid.

#### Example Request

http

Copy code

`POST /pdf/upload
Content-Type: multipart/form-data
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` 

#### Example Response


```json
`{
  "message": "PDF upload and correction successful",
  "correctedText": "Corrected text from the PDF."
}
```

  

## Setup and Deployment

  

### Prerequisites

  

- Node.js and npm installed

- Firebase project setup

- Google OAuth credentials

- Environment variables configured

  

### Environment Variables

  

Create a `.env` file in the root directory of your project with the following content:

```bash

FIREBASE_PROJECT_ID=your_firebase_project_id

GOOGLE_CLIENT_ID=your_google_client_id

GOOGLE_CLIENT_SECRET=your_google_client_secret

JWT_SECRET=your_jwt_secret

```

  

### Installation

  

1. Clone the repository:

  

`git clone https://github.com/your-repo/project-name.git`

  

2. Install the dependencies:

  

```

cd project-name

npm install

```

### Running the Server

  

To start the server, run:

  

`npm start`

  

The server will be running on `http://localhost:3000`.

  

## Deployment

  

### Google Cloud Platform (GCP)

  

This project can be deployed on Google App Engine. Follow these steps:

  

1. Create a new project on Google Cloud Platform.

2. Enable the App Engine and Firestore APIs.

3. Install the Google Cloud SDK and initialize it.

4. Deploy the application:

  

`gcloud app deploy`

  

### Example App Engine Configuration

  

Create an `app.yaml` file in the root directory of your project with the following content:

```bash

runtime:  nodejs18

  

env_variables:

FIREBASE_PROJECT_ID:  "your_firebase_project_id"

GOOGLE_CLIENT_ID:  "your_google_client_id"

GOOGLE_CLIENT_SECRET:  "your_google_client_secret"

JWT_SECRET:  "your_jwt_secret"

  
  

automatic_scaling:

min_instances:  1

max_instances:  20

target_cpu_utilization:  0.6

target_throughput_utilization:  0.75

```
