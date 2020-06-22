const express = require("express");
const server = express();

const db = require("./database/db");

server.use(express.static("public"));

// habilitar o uso de req.body na nossa aplicação
server.use(express.urlencoded({ extended: true }));

// Template Engine 
const nunjucks = require("nunjucks");

server.set("view engine", "njk");

nunjucks.configure("src/views", {
    express: server,
    noCache: true
});

server.get("/", function(req, res){
    return res.render("index.njk");
});

server.get("/create-point", function(req, res){    

    return res.render("create-point.njk");
});

server.post("/savepoint", function(req, res){

    const query = `
    INSERT INTO places (
        image,
        name,
        address,
        address2,
        state,
        city,
        items

    ) VALUES (?,?,?,?,?,?,?);
    `;

    const values = [
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items
    ];

    function afterInsertData(err){
    if (err) {
        console.log(err);
        return res.send("Erro no cadastro");
    }

    console.log("Cadastrado com sucesso");
    console.log(this);

    return res.render("create-point.njk", { saved: true } );
    }

    db.run(query, values, afterInsertData );
    
});

server.get("/search", function(req,res){

    const search = req.query.search;

    if (search == "") { 
        return res.render("search_results.njk", { total: 0 });
    }

    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%' `, function(err, rows){
        if (err) {
            return console.log(err);
        }

        const total = rows.length;

        return res.render("search_results.njk", { places: rows, total: total });        
    });
    
});

server.listen(3000, function(){
    console.log("server is running");
});
