const sqlite3 = require('sqlite3').verbose();

// Create new db
let db = new sqlite3.Database('./config/PulseConnect_db.db');

// create table Users
db.serialize(function() {
    db.run(`CREATE TABLE Users (
        UserID INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        Name TEXT,
        LastName TEXT,
        Email TEXT UNIQUE NOT NULL,
        Password TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // create table Conversations
    db.run(`CREATE TABLE Conversations (
        ConversationID INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE, 
        SenderID INTEGER NOT NULL,
        RecipientID INTEGER NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        MessageText TEXT,
        FOREIGN KEY (SenderID) REFERENCES Users(UserID),
        FOREIGN KEY (RecipientID) REFERENCES Users(UserID)
    )`);
    // Create table Contacts
    db.run(`CREATE TABLE Contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
        UserID INTEGER NOT NULL,
        ContactID INTEGER NOT NULL,
        ContactName TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(UserID, ContactID),
        FOREIGN KEY (UserID) REFERENCES Users(UserID),
        FOREIGN KEY (ContactID) REFERENCES Users(UserID)
    )`);
});


// Close DB connect
db.close();
