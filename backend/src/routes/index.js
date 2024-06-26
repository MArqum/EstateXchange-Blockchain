const routes = [
    { path: "/user", controller: require("./user") },
    { path: "/admin", controller: require("./admin")},
    { path: "/property", controller: require("./property")},
    { path: "/buyProperty", controller: require("./buyedProperty") },
    {path:"/balance", controller:require("./propertyBalance")}  
];

module.exports = (app) => {
    for (const route of routes) {
        app.use(`/api/v1${route.path}`, route.controller);
    }
};
