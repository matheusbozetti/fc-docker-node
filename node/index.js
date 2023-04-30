const express = require("express");
const mysql = require("mysql");

const app = express();
const port = 3000;

const DBConfig = {
  host: "db",
  user: "root",
  password: "secret",
  database: "nodedb",
};

const connection = mysql.createConnection(DBConfig);


app.get("/", async (_, res) => {
  const person = generatePersonName();

  //	connection.connect();

  await createPersonOnDb(person);
  const people = await getPeopleFromDB();

  // connection.end();

  const responseBody = generateResponseBody(people);

  res.send(responseBody);
});

app.listen(port, () => {
  console.log(`🚀 Listening on port ${port}`);
});

// Functions

function generatePersonName() {
  const names = ["José", "Ana", "Maria", "João", "Matheus", "Jonas", "Michele"];
  const randomIndex = Math.floor(Math.random() * names.length - 1) + 1;

  return names[randomIndex];
}

async function createPersonOnDb(personName) {
  const stmt = `INSERT INTO people(name) VALUES ('${personName}')`;
  await new Promise((resolve, reject) => {
    connection.query(stmt, (err) => {
      if (err) {
        reject(err)
      }
      resolve()
    });
  }
  )
}

async function getPeopleFromDB() {
  const selectAllQuery = "SELECT id, name FROM people";

  return new Promise((resolve, reject) => {
    connection.query(selectAllQuery, (err, data) => {
      if (err) {
        reject(err)
      }

      resolve(data)
    })
  });
}

function generateResponseBody(people) {
  const peopleOnTableLines = people.reduce((acc, person) => {
    const html = `
      <tr>
        <td>${person.id}</td>
        <td>${person.name}</td>
      </tr>
    `;

    return acc + html;
  }, "");

  return `
<html>
  <head>
    <title>Desafio Node Full Cycle</title>
  </head>
  <body>
     <h1>Full Cycle Rocks!!</h1><hr /><br />
     <table>
       <thead>
         <tr>
           <th>#</th>
           <th>Name</th>
         </tr>  
       </thead>
       <tbody>
         ${peopleOnTableLines}
       </tbody>
     </table>
  </body>
</html>
  `;
}
