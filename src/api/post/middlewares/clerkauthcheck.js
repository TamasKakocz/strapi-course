"use strict";

const jwt = require("jsonwebtoken");
const fs = require("fs");

/**
 * `clerknewauth` middleware
 */

module.exports = (config, { strapi }) => {
  // Add your own logic here.
  return async (ctx, next) => {
    const bearerToken = ctx.request.header.authorization;
    if (!bearerToken) {
      throw new Error("No token provided");
    }
    const token = bearerToken?.replace("Bearer ", "");
    const publicKey = fs.readFileSync("jwt.pem");

    try {
      const decoded = jwt.verify(token, publicKey);
      console.log("🚀 ~ file: clerkAuth.js:22 ~ testToken ~ decoded:", decoded);

      // Continue to the next middleware or route handler
      strapi.log.info("Clerk auth passed");
      await next();
    } catch (err) {
      // Handle authentication errors here
      console.error("Authentication error:", err);
      ctx.response.status = 401; // Unauthorized
      ctx.response.body = { error: "Authentication failed" };
    }
  };
};
