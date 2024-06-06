# REST API Documentation

  

## Introduction

This REST API provides endpoints for user registration, login, logout

  

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

-  `200 OK`: Login berhasil .
-  `403 Forbidden`: Kata sandi salah.
-  `404 Not Found`: Pengguna tidak ditemukan.

  

#### Example Request

  

```json
{"email": "johndoe@example.com", "password": "securepassword123"}
```
#### Example Response

```json
{ "data": { "id": "johndoe@example.com", "name": "John Doe", "address": "-" }, "token": "#" }
```

### 2. User Logout

  

#### Endpoint

`/logout`

  

#### Method

`POST`

  

#### Parameters

-  `Authorization` (header): Bearer token JWT.


 
#### Response

-  `200 OK`: Logout berhasil .
-  `403 Forbidden`: Token tidak valid.

  

#### Example Request
```json
POST /logout
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
#### Example Response

```json
{ "message": "Logout successful" }
```