const next = require('next');
const routes = require('./routes');
const {createServer} = require('http');


const app = next({
    dev: process.env.NODE_ENVV !=='production'

});

const handler = routes.getRequestHandler(app, ({req, res, route, query}) => {
    app.render(req, res, route.page, query)
  })

app.prepare().then(()=> {

    
    createServer(handler).listen(3002, err=> {
        if(err) throw err;
        console.log('Ready on localhost:3002');
    })
})