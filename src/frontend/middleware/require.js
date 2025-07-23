const fs = require("fs");
const express = require("express");
const router = express.Router();

const authController = require("./controllers/authController");
const requireAuth = require("./middleware/requireAuth");

// Auth routes
router.get("/api/nonce", authController.Nonce);
router.post("/api/verify", authController.Verify);
router.get("/api/validate", requireAuth, authController.Validate);

// Frontend routes
const frontendRoutes = ["/", "/login"];
frontendRoutes.forEach((route) => {
  router.get(route, (_, res) => {
    fs.readFile(__dirname + "/index.html", "utf8", (_, text) => {
      res.send(text);
    });
  });
});

module.exports = router;
