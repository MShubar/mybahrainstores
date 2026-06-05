import { httpRouter } from "convex/server";
import { auth } from "./auth";
import { tapWebhook } from "./payments/webhooks";

const http = httpRouter();

auth.addHttpRoutes(http);

http.route({
  path: "/tap/webhook",
  method: "POST",
  handler: tapWebhook,
});

export default http;
