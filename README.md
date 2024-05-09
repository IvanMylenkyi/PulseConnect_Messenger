## PulseConnect README
PulseConnect is a web application for exchanging messages between users. The application is built on Node.js using the Express.js framework. Local SQLite3 database is used to store data and Sequalize ORM helps to interact with it. JWT (JSON Web Tokens) is used for user authentication.
### Features:
- User Registration and Authentication using JWT
- CRUD Operations for Contacts
- Messaging Functionality between Users
### Technologies Used:
- Node.js
- Express.js
- SQLite3
- Sequelize
- JWT
### Installation:
- Clone the repository:
git clone https://github.com/IvanMylenkyi/PulseConnect_Messenger.git

- Install dependencies:
npm install

- Set up the SQLite database:
node config/createDB.js

- Start the server:
node server.js

- Access the application at http://localhost:5000
### Endpoints:
- POST /api/users/register: Register a new user
- POST /api/users/login: User login and authentication
- GET /api/contacts: Get all contacts
- POST /api/contacts: Create a new contact
- GET /api/contacts/:id: Get a specific contact
- POST /api/contacts/:id/upd: Update a contact
- POST /api/contacts/:id/del: Delete a contact
- GET /api/contacts/:id/conversations: Get conversation
- POST /api/contacts/:id/conversations: Send a new message
### Usage:
- Register a new user using /api/users/register endpoint.
- Login with the registered user credentials using /api/users/login endpoint to obtain a JWT token.
- Use the JWT token in the Authorization header for accessing protected routes.
- Perform CRUD operations on contacts using the respective endpoints.
- Exchange messages between users using the messaging endpoints.
### Contributors:
## Ivan Mylenkyi
### License:
This project is licensed under the MIT License - see the LICENSE file for details.
Feel free to customize this README file according to your specific project details and requirements.



#### P.S.
 - frontend for this project is VERY simple! Only for demonstration my backend project!
