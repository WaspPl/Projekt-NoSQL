## Table of Contents
- **[Getting Started](#getting-started)**<br>
- **[Installing](#installing)**<br>
- **[API Endpoints](#api-endpoints)**<br>
- **[POST Endpoint](#post-endpoints)**<br>
- **[Owners Endpoint](#owners-endpoints)**<br>
- **[Apartments Endpoint](#apartments-endpoints)**<br>
- **[Reviews Endpoints](#reviews-endpoints)**<br>


# backend-api
Back-end RESTful API for use with Node.js</br>
Made for easy management of a database contining "Owners", "Apartments" and "Reviews" collections.</br>
Uses MongoDB.

# Getting Started

This API is made for a university project and is not made to be used commercially.</br>
That being said, if you do want to use it anyway, check the Installing section.
# Installing

1. Clone the repository   
2. In the main folder create a .env file.</br>
The file should contain your credentials needed to access a mongodb cluster.</br>
Structure it like this. (replace "Example" with correct values):
```
DB_USER="Example"
DB_PASSWORD="Example"
DB_NAME="Example"

```
3. Run the server with Node.js
```
node server.js
```

Owners
| Method | Route                  | Description                                      |
|--------|------------------------|--------------------------------------------------|
| POST   | /owners                | registers new users as owners                    |
| GET    | /owners                | lists all owners and their apartments            |
| GET    | /owners:id             | lists all information about the owner by :id.    |
| PUT    | /owners:id             | updates info about the owner specified by :id    |
| DELETE | /owners:id             | deletes the owner, their apartments and reviews.  |


Apartments
| Method | Route                  | Description                                      |
|--------|------------------------|--------------------------------------------------|
| POST   | /apartments            | creates a new apartment                          |
| GET    | /apartments            | lists all apartments, their owners and reviews   |
| GET    | /apartments:id         | list all info about the apartment with :id       |
| PUT    | /apartments:id         | updates info about the apartment specified by :id|
| DELETE | /apartments:id         | deletes the apartment, including its reviews.    |


Apartments
| Method | Route                  | Description                                      |
|--------|------------------------|--------------------------------------------------|
| POST   | /reviews               | creates a new review                             |
| GET    | /reviews               | lists all reviews                                |
| GET    | /reviews:id            | list all info about the review with :id          |
| PUT    | /reviews:id            | updates info about the review specified by :id   |
| DELETE | /reviews:id            | deletes the review specified with :id            |


## Post endpoints
### Owners
```js
POST /owners
```
Expected Body 
```js
 {
  name: "name", //string ,required
  address: {
    country: "Poland", //string
    city: "Wroclaw", //string
    street: "testing"
  },
  email: "example@email.com" //string, required
}
```

Expected Response
```js
    {
    "message": "New owner account successfully created",
    "data": {
        "name": "name",
        "address": {
            "country": "Poland",
            "city": "Wroclaw",
            "street": "testing"
        },
        "email": "example@email.com",
        "_id": "67895c64f5d539e90e754e99",
        "__v": 0
    }
```

### Apartments
```js
POST /apartments
```
Expected Body
```js
{
    name: "name of an apartment", //string, required
    address: {
      country: "Poland", //string
      city: "Wroclaw", //string
      street: "testing", //string
      lon: 12.345, //Number
      lat: 3.1415 //Number
    },
    desc: "A description for your apartment", //string
    price: {
      adult: 50, //Number, required
      child: 30 //Number, required
    },
    ownerId: "67895c64f5d539e90e754e99" //ObjectId, required, owner with that Id must exist
}
```
Expected Response
```js
{
    "wiadomosc": "Apartment added successfully",
    "dane": {
        "name": "name of an apartment",
        "address": {
            "country": "Poland",
            "city": "Wroclaw",
            "street": "testing",
            "lon": 12.345,
            "lat": 3.1415
        },
        "desc": "A description for your apartment",
        "price": {
            "adult": 50,
            "child": 30
        },
        "ownerId": "67895c64f5d539e90e754e99",
        "_id": "678968abf5d539e90e754e9b",
        "__v": 0
    }
}
```

### Reviews
```js
POST /reviews
```
Expected Body
```js
{
 "apartmentId": "678a6e3af5d539e90e754eab", //ObjectId, required
  "reviewer": "alan", //string, if no name provided it'll be set to "Anonymous Reviewer",
  "rating": 3, //Number, min 1, max 5
  "comment": "hey, this is a comment i created" //string
}
  
```
Expected Response
```

{
    "message": "Successfully added the review",
    "data": {
        "apartmentId": "678a6e3af5d539e90e754eab",
        "reviewer": "alan",
        "rating": 3,
        "comment": "hey, this is a comment i created",
        "_id": "678a6f1af5d539e90e754eae",
        "dateEdited": "2025-01-17T14:54:18.848Z",
        "dateCreated": "2025-01-17T14:54:18.848Z",
        "__v": 0
    }
}

```

## Owners Endpoints
### GET All owners
```js
GET /owners

Expected Response: returns array of owners in database 

{
  "message": "List of all owners",
  "data": [
    {
      "_id": "678945ed54569f21e1806c2a",
      "name": "John Arbackle",
      "address": {
        "country": "Indiana",
        "city": "Muncie",
        "street": "Lasagne"
      },
      "email": "J.Arbackle@lasagne.com",
      "__v": 0,
      "apartmentsData": []
    },
    {
      "_id": "67895c64f5d539e90e754e99",
      "name": "name",
      "address": {
        "country": "Poland",
        "city": "Wroclaw",
        "street": "testing"
      },
      "email": "example@email.com",
      "__v": 0,
      "apartmentsData": [
        {
          "_id": "678968abf5d539e90e754e9b",
          "name": "name of an apartment",
          "address": {
            "country": "Poland",
            "city": "Wroclaw",
            "street": "testing",
            "lon": 12.345,
            "lat": 3.1415
          },
          "desc": "A description for your apartment",
          "price": {
            "adult": 50,
            "child": 30
          },
          "ownerId": "67895c64f5d539e90e754e99",
          "__v": 0
        }
      ]
    }
  ]
}
```

### Get owner by id
```js
POST /owners/:id

Expected Response: returns info about owner with specified id 

{
  "message": "Information about the owner with id 67895c64f5d539e90e754e99}",
  "data": [
    {
      "_id": "67895c64f5d539e90e754e99",
      "name": "name",
      "address": {
        "country": "Poland",
        "city": "Wroclaw",
        "street": "testing"
      },
      "email": "example@email.com",
      "__v": 0,
      "apartmentsData": [
        {
          "_id": "678968abf5d539e90e754e9b",
          "name": "name of an apartment",
          "address": {
            "country": "Poland",
            "city": "Wroclaw",
            "street": "testing",
            "lon": 12.345,
            "lat": 3.1415
          },
          "desc": "A description for your apartment",
          "price": {
            "adult": 50,
            "child": 30
          },
          "ownerId": "67895c64f5d539e90e754e99",
          "__v": 0
        }
      ]
    }
  ]
}
```

### PUT Owner By ID
```js
PUT /owners/:id

Expected Body:
    {
        "name": "test123" //updated field
    }

Expected Response: updates campaign specified by :id

{
    "message": "Owner 678a671df5d539e90e754ea9 successfully updated",
    "data": {
        "address": {
            "country": "Poland",
            "city": "Wroclaw",
            "street": "testing"
        },
        "_id": "678a671df5d539e90e754ea9",
        "name": "test123",
        "email": "example@email.com",
        "__v": 0
    }
}
```

### DELETE owner by ID
TODO
```js
DELETE /owners/:id

Expected Response: deletes the owner specified by :id along with their apartmets and their reviews

Expected Response: 
    {
    "message": "Successfully deleted owner account 678a671df5d539e90e754ea9 and its apartments along with their reviews"
    }
```
## Apartments Endpoints
```js
GET /apartments

Expected Response: returns all apartments

Expected Response: 
{
  "message": "Apartments list",
  "lista": [
    {
      "_id": "678a6e3af5d539e90e754eab",
      "name": "name of an apartment",
      "address": {
        "country": "Poland",
        "city": "Wroclaw",
        "street": "testing",
        "lon": 12.345,
        "lat": 3.1415
      },
      "desc": "A description for your apartment",
      "price": {
        "adult": 50,
        "child": 30
      },
      "ownerId": "678a671df5d539e90e754ea9",
      "__v": 0,
      "reviews": [
        {
          "_id": "678a6f1af5d539e90e754eae",
          "apartmentId": "678a6e3af5d539e90e754eab",
          "reviewer": "alan",
          "rating": 3,
          "comment": "hey, this is a comment i created",
          "dateEdited": "2025-01-17T14:54:18.848Z",
          "dateCreated": "2025-01-17T14:54:18.848Z",
          "__v": 0
        }
      ],
      "ownerInfo": [
        {
          "_id": "678a671df5d539e90e754ea9",
          "name": "test123",
          "address": {
            "country": "Poland",
            "city": "Wroclaw",
            "street": "testing"
          },
          "email": "example@email.com",
          "__v": 0
        }
      ]
    }
  ]
}
```

### GET Apartment by ID
```js
GET /apartments/:id

Expected Response: returns the apartment specified by :id.

Expected Response:
    {
  "wiadomosc": "Details on the apartment 678a6e3af5d539e90e754eab",
  "data": [
    {
      "_id": "678a6e3af5d539e90e754eab",
      "name": "name of an apartment",
      "address": {
        "country": "Poland",
        "city": "Wroclaw",
        "street": "testing",
        "lon": 12.345,
        "lat": 3.1415
      },
      "desc": "A description for your apartment",
      "price": {
        "adult": 50,
        "child": 30
      },
      "ownerId": "678a671df5d539e90e754ea9",
      "__v": 0,
      "reviews": [
        {
          "_id": "678a6f1af5d539e90e754eae",
          "apartmentId": "678a6e3af5d539e90e754eab",
          "reviewer": "alan",
          "rating": 3,
          "comment": "hey, this is a comment i created",
          "dateEdited": "2025-01-17T14:54:18.848Z",
          "dateCreated": "2025-01-17T14:54:18.848Z",
          "__v": 0
        }
      ],
      "ownerInfo": [
        {
          "_id": "678a671df5d539e90e754ea9",
          "name": "test123",
          "address": {
            "country": "Poland",
            "city": "Wroclaw",
            "street": "testing"
          },
          "email": "example@email.com",
          "__v": 0
        }
      ]
    }
  ]
}
```

### PUT apartment by :id
```js
PUT /apartments/:id

Expected Body:

        {
            "desc":"this description got changed with a PUT request"
        }

Expected Response:  updates user info specified by id
Expected Response

    {
    "message": "Apartment 678a6e3af5d539e90e754eab updated",
    "data": {
        "address": {
            "country": "Poland",
            "city": "Wroclaw",
            "street": "testing",
            "lon": 12.345,
            "lat": 3.1415
        },
        "price": {
            "adult": 50,
            "child": 30
        },
        "_id": "678a6e3af5d539e90e754eab",
        "name": "name of an apartment",
        "desc": "this description got changed with a PUT request",
        "ownerId": "678a671df5d539e90e754ea9",
        "__v": 0
    }
}
```

### Delete apartment
```js
DELETE /apartments/:id

Expected Response: deletes an apartment specified by :id along with its reviews

Expected Response: 
    {
    "message": "Successfully deleted apartment 678a6e3af5d539e90e754eab and its reviews"
    }
```

## Reviews Endpoints
### Get all reviews
```js
GET /reviews

Expected Response:  Lists all reviews posted
Expected Response:

{
  "message": "A list of all opinions",
  "data": [
    {
      "_id": "6789461954569f21e1806c31",
      "apartmentId": "678945fd54569f21e1806c2c",
      "reviewer": "Anonymous reviewer",
      "rating": 4,
      "comment": "this review just got edited",
      "dateEdited": "2025-01-16T18:44:44.577Z",
      "dateCreated": "2025-01-16T17:47:05.808Z",
      "__v": 0
    },
    {
      "_id": "678a6f1af5d539e90e754eae",
      "apartmentId": "678a6e3af5d539e90e754eab",
      "reviewer": "alan",
      "rating": 3,
      "comment": "hey, this is a comment i created",
      "dateEdited": "2025-01-17T14:54:18.848Z",
      "dateCreated": "2025-01-17T14:54:18.848Z",
      "__v": 0
    }
  ]
}
```

 ### Get review info by id
```js
GET /review/:id

Expected Response: Lists info about a review and it's apartment by :id of the review

Expected Response:
    {
  "message": "Details of the review with ID 678a6f1af5d539e90e754eae",
  "data": [
    {
      "_id": "678a6f1af5d539e90e754eae",
      "apartmentId": "678a6e3af5d539e90e754eab",
      "reviewer": "alan",
      "rating": 3,
      "comment": "hey, this is a comment i created",
      "dateEdited": "2025-01-17T14:54:18.848Z",
      "dateCreated": "2025-01-17T14:54:18.848Z",
      "__v": 0,
      "aboutApartment": [
        {
          "_id": "678a6e3af5d539e90e754eab",
          "name": "name of an apartment",
          "address": {
            "country": "Poland",
            "city": "Wroclaw",
            "street": "testing",
            "lon": 12.345,
            "lat": 3.1415
          },
          "desc": "this description got changed with a PUT request",
          "price": {
            "adult": 50,
            "child": 30
          },
          "ownerId": "678a671df5d539e90e754ea9",
          "__v": 0
        }
      ]
    }
  ]
}
```

### PUT review by id
```js
PUT /reviews/:id

Expected Body:
    {
    "comment":"edited with a put request"
    }

Expected Response: updates review specified by :id

Expected Response:
{
    "message": "Review 678a6f1af5d539e90e754eae successfully updated",
    "data": {
        "_id": "678a6f1af5d539e90e754eae",
        "apartmentId": "678a6e3af5d539e90e754eab",
        "reviewer": "alan",
        "rating": 3,
        "comment": "edited with a put request",
        "dateEdited": "2025-01-17T16:00:14.007Z",
        "dateCreated": "2025-01-17T14:54:18.848Z",
        "__v": 0
    }
}
```

### DELETE review by ID
```js
DELETE /reviews/:id

Expected Response: deletes review specified by :id

Expected Response: 
    {
    "message": "Successfully deleted review 678a6f1af5d539e90e754eae"
    }
```

