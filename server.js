'use strict';
/* Require zone */
const express = require('express');
const mongo = require('mongodb');
const mongoose = require('mongoose');
const cors = require('cors');
const dns = require('dns');
const bodyParser = require('body-parser');

/* Initialize express */
const app = express();

/* Settings */
const port = process.env.PORT || 3000;

/* Database connection */

/* Middlewares */
app.use(cors());

/* Body parser */
app.use(bodyParser.urlencoded({extended: false}));

app.use('/public', express.static(process.cwd() + '/public'));

/* Routes */
app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

/* My stuff */
const links = [];
let id = 0;

app.post('/api/shorturl/new', (request, response) => {
  /* Deconstruct in url*/
  const {url} = request.body;
  const rm_https = url.replace(/^https?:\/\//,'');
  
  /* Check if URL is valid */
  dns.lookup(rm_https, err => {
    if(err){
      return response.json({
        error: "invalid URL"
      });
    }else{
      /* Increment id */
      id++;
      
      /* Create new entry for our array */
      const link = {
        original_url: url,
        short_url: `${id}`
      }
       
      links.push(link);
      
      /* Return this new entry */
      return response.json(link);
    }
  });
});

app.get('/api/shorturl/:id', (request, response) => {
  const {id} = request.params;
  const link = links.find(l => l.short_url === id);
  if(link){
    return response.redirect(link.original_url);  
  }else{
    return response.json({error: "No short url"});    
  }
});

/* Start server */
app.listen(port, function () {
  console.log('Node.js listening ...');
});
