# Documentation

1. [MERN Stack](#1-mern-stack)

2. [MongoDB](#1-mongodb)
  - 1.1. [Introduction](#11-introduction)
  - 1.2. [How to use MongoDB](#12-how-to-use-mongodb)
  - 1.3. [Useful commands](#13-useful-commands)
  - 1.4 [Mongoose ODM](#14-mongoose-odm)
  - 1.5. [Mongoose Population](#15-mongoose-population)
  - 1.6. [Resources](#16-resources)

## 1. MERN Stack
The MERN stack consists of the following technologies:
 - **MongoDB**: A document-based open source database.
 - **Express**: A web application framework for Node.js.
 - **React**: A JavaScript front-end library for building user interfaces.
 - **Node.js**: JavaScript run-time environment that executes JavaScript code outside of a browser (such as a server).

- And **Mongoose**:  which is a simple, schema-based solution to model application data.

We’ll be hosting our database in the cloud using MongoDB Atlas and AWS. First we’ll review MongoDB and create a MongoDB Atlas account, then other technologies.

## 1. MongoDB

### 1.1. Introduction

| Tabular(Relational) | MongoDB |
| :---   | :- |
| Database | Database |
| Table | Collection |
| Row | Document |
| Index | Index |
| Join | $lookup |
| Foreign Key | Reference |

- In the tabular, or relational world, we think of things like databases, tables, row, etc. MongoDB has similar concepts that use different terms.
- Document database
- MongoDB stores document in More compact form, BSON (Binary JSON)
- BSON supports
  - length prefix on each value
  - information about type of field value
  - Additional primitives types not supported by raw json like UTC date time, raw binary, ObjectId
- MongoDB ObjectId:
  - Every document must have "\_id" (unique primary field)
  - Default ObjectId created by Mongo
  - ObjectId is a 12 byte field
  ***
  | Timestamp(4) | Machine Id(3) | ProcessId(2) | Increment(3) |
  ***
  - e.g.
  ```bson
  {
  	"_id"	:	ObjectId("56ce74c0b02806eff4558f1f"),
  	"name"	:	"Uthapizza",
  	"description"	:	"Test"
  }
  ```
  - Install MongoDB in your pc
  - After that to run mongo server
  ```sh
  mongod --dbpath="D:\Learning\Full-Stack\mongodb\data" --bind_ip 127.0.0.1
  mongo
  ```
  - way to install mongoDB driver in nodejs
  ```sh
  npm install mongodb --save
  npm install assert --save
  ```

### 1.2. How to use MongoDB
You can host your MongoDB database locally but We’ve found that it is easier to host the database using MongoDB Atlas.
The first step is to make an account at the MongoDB Atlas website.

you can follow [this tutorial](https://www.youtube.com/watch?v=esKNjzDZItQ&list=PLqwmiTs6Z6PFR023K5e26J3si-Yd53JSz&index=4) to perform further steps.
1. Open mongoDb Atlas on browser
2. Login using your credentials
3. Create cluster
4. Setup network access: Add IP Address to your Access List
5. Setup database access: Create your first database user
6. You can connect to your cluster using:
    - 6.1. Mongo Shell.
    - 6.2. MongoDB Compass.
    - 6.3. Your application using connection string.
7. **NOTE**: <i>**TTL indexes**</i> = Index can be added to collections. Delete documents after some time
### 1.3. Useful commands
  - `mongod` - to start mongo db core server
  - `mongo` - to start mngo shell
  - `mongo --help`
  - `mongo --host 127.0.0.1 --port 27017 -u <username> -p <password>`
  - connectionstring: `mongodb://[username:password@]host[:port]` e.g."mongodb://testuser:test123@127.0.0.1:127017"

  [After entrying in mongo shell]
  - `db.help`
  - `db.<collection-name>.help`
  - `quit()` - to quit mongo shell
  - `show dbs`
  - `show collections`
  - `use <db-name>`
  - `db.serverCmdLineOpts()`: to know DB paths and other configuration
  - `use new-db-name`: to create new db (NOTE: when you use this command, db is not get generated right away, even if you do `show dbs`, you will not see the db you created. you need to put data inside it to generate that db.)
  - `db.createCollection("collection-name")`: to create collection in db.
  - `db.dropDatabase()`: to delete current database
  - `db.<collection-name>.drop()`: to delete collection
  - `db.employee2.insertOne({'first': 'name'})`: here he first chaeck is collection name 'employee2', if not it will create collection first, and then insert data.
  - `db.createCollection('logs', {capped: true, size: 2048, max: 2})`: to created Capped collection (special type of collection)

### 1.4 Mongoose ODM

- Adds sturcture to MongoDB documents through schema
- Mongoose internally use MongoDB Driver
- Means you can use all MongoDB driver method through Mongoose modules
- people refers as:
  - Object Data Model (ODM)
  - Object Document Mapping (ODM)
  - Object relational Mapping (ORM)
- **Mongoose Schema**
  - Structure of the data to be stored
  - Defines all the fields of your document and their types (Can do validation)
  - Schema types:
    - string
    - number
    - date
    - buffer
    - boolean
    - Mixed
    - ObjectId
    - Array
  - Schema is used to create a model function
  - Schema can be nested
- **Process**

  - Define the schema in Nodejs application

  ```js
  const mongoose = require('mongoose');
  const Schema = mongoose.Schema;

  const dishSchema = new Schema(
  	{
  		name: {
  			type: String,
  			required: true,
  			unique: true,
  		},
  		description: {
  			type: String,
  			required: true,
  		},
  	},
  	{
  		timestamps: true,
  	}
  );
  ```

  - NOTE: Mongoose can automatically createdAt, updatedAt like field in documents by using `timestamps: true` parameter
  - Create a model from that schema

  ```js
  var Dishes = mongoose.model('Dish', dishSchema);
  ```

  - you will also give a name to the model e.g. Dish
  - When you use this model in our node application where we are making use of Mongoose, then this will be transformed and mapped into a collection in MongoDB database.
  - Mongoose automatically construct the plural of that name and then give the collection the name, which is the plural of the model name that you specify in this example here.
  - Then exports this model

  ```js
  module.exports = Dishes;
  ```

### 1.5. Mongoose Population

- Mongoose do not explicitly support relations like SQL Databases
- You can store references to other documents within documentb by using ObejctIds
- Mongoose doesn't have joins
- Mongoose population populated reference documents into current document
- **Population is the process of automatically replacing specified paths within a document with documents from another collection.**
- Schema will be

```js
var commentSchema = new Schema(
	{
		rating: { type: Number, min: 1, max: 5, required: true },
		comment: { type: String, required: true },
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
	},
	{ timestamps: true }
);
```

- **NOTE:** Population operation is not an easy task for the server to do. it'll take a much longer time for the server side to complete the request. **You should use it only in circumstances where you really need that information.**

### 1.6. Resources
- [MongoDB Basics Beginner Tutorials | JR ACADEMY](https://www.youtube.com/playlist?list=PLqwmiTs6Z6PFR023K5e26J3si-Yd53JSz)