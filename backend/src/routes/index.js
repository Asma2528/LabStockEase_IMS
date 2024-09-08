const router = require("express").Router();

// Routes configuration with paths and corresponding route files
const routes = [
    {
        path: '/auth',
        route: require("./Auth.route")
    },
    {
        path: '/chemicals',
        route: require("./Chemicals.route")
    },
    {
        path: '/reagants',
        route: require("./Reagants.route")
    },
    // {
    //     path: '/physics',
    //     route: require("./Physics.route")
    // },
    // {
    //     path: '/biology',
    //     route: require("./Biology.route")
    // },
    // {
    //     path: '/botany',
    //     route: require("./Botany.route")
    // },
    // {
    //     path: '/microbiology',
    //     route: require("./Microbiology.route")
    // },
    // {
    //     path: '/lifescience',
    //     route: require("./LifeScience.route")
    // }
];

// Loop through the routes and use them in the router
routes.forEach((cur) => {
    router.use(cur.path, cur.route);
});

module.exports = router;
