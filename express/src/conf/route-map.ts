import controller from "../controller";

export const routes = {
  "/routing": controller.routing,
};

export const menu = [
  { text: "Routing", url: "/routing" },
  { text: "Middleware", url: "/middleware" },
  { text: "Error Handing", url: "/error-handing" },
  { text: "Debug", url: "/debug" },
  { text: "Database", url: "/database" },
];
