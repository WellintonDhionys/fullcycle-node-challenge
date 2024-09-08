const express = require('express')
const app = express()
const port = 3000
const config = {
    host: 'db',
    user: 'root',
    password: 'root',
    database:'nodedb'
};
const Chance = require('chance');
const mysql = require('mysql2')
const connection = mysql.createConnection(config)

const createTable = `CREATE TABLE IF NOT EXISTS people (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255),
    PRIMARY KEY(id)
)`;

connection.query(createTable, (err) => {
    if (err) throw err;
    console.log('Tabela criada ou já existe.');
});

connection.end()

const chance = new Chance();

app.get('/', (req,res) => {
    const connection = mysql.createConnection(config);
    const name = chance.name();

    const sql = `INSERT INTO people(name) values('${name}')`
    connection.query(sql, (err) => {
        if (err) throw err;
        console.log('Pessoa inserida.');
    });

    connection.query('SELECT name FROM people', (err, results) => {
        if (err) throw err;
        const names = results.map(row => `<li>${row.name}</li>`).join('');
        const html = `
            <h1>Full Cycle Rocks!</h1>
            <h2>Nomes cadastrados:</h2>
            <ul>${names}</ul>
        `;
        res.send(html);
    });
    connection.end();
})

app.listen(port, ()=> {
    console.log('Rodando na porta ' + port)
})