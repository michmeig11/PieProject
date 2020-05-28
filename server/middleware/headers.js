// req, res, next will always be in that order due to the express doc 


module.exports = (req, res, next) =>{
    res.header('access-control-allow-origin', '*'); // * allowing access to our server from anywhere as long at it passes the other allowances
    res.header('access-control-allow-methods', 'GET, POST, PUT, DELETE'); // what methods are going to be allowed
    res.header('access-control-allow-headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization'); //preflight request checks to see if CRUD is allowed.
    
    next();
};