const controller = require("../controller");

const routes = {
  "/routing": controller.routing,
};

const menu = [
  { text: "Routing", url: "/routing" },
  { text: "Middleware", url: "/middleware" },
  { text: "Error Handing", url: "/error-handing" },
  { text: "Debug", url: "/debug" },
  { text: "Database", url: "/database" },
];

module.exports = {
  routes, menu
};
