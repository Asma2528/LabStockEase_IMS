// It consists of all the routes
const router = require("express").Router(); // to use Router function inside express

const routes = [
    {
        path:'/auth',
        route:require("./Auth.route")
    },
    {
      path:'/chemistry',
      route:require("./Chemistry.route")
  }
]

routes.forEach((cur)=>{ // cur - current element
    router.use(cur.path,cur.route);
})

module.exports =  router;