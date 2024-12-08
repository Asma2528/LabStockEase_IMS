const router = require("express").Router();

// Routes configuration with paths and corresponding route files
const routes = [
    {
        path: '/auth',
        route: require("./Auth.route")
    },
    {
        path: '/vendor',
        route: require("./Vendors.route")
    },
    {
        path: '/chemistry-dashboard',
        route: require("./Chemistry.dashboard.route")
    },
    {
        path: '/chemicals',
        route: require("./Chemicals.route")
    },
    {
        path: '/reagents',
        route: require("./Reagents.route")
    },
    {
        path: '/glassware',
        route: require("./Glassware.route")
    },
    {
        path: '/measuring',
        route: require("./Measuring.route")
    },
    {
        path: '/others',
        route: require("./Others.route")
    },    
    {
        path: '/chemistry-requisition', 
        route: require("./Chemistry.Requisition.route")
    },
    {
        path: '/notification', 
        route: require("./Notification.route")
    }

];

// Loop through the routes and use them in the router
routes.forEach((cur) => {
    router.use(cur.path, cur.route);
});

module.exports = router;
