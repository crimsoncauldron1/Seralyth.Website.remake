const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, "data", "serverdata.json");

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

function loadData() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch {
    return {
      "menu-version": "5.0.2",
      "min-version": "4.5.1",
      "min-console-version": "2.8.0",
      "discord-invite": "https://discord.gg/seralyth",
      "motd": "You are using build {0}. This menu was created by Seralyth Software.",
      "admins": [],
      "super-admins": [],
      "owners": [],
      "april_fools": { "sex": false },
      "detected-mods": [],
      "poll": "",
      "option-a": "Yes",
      "option-b": "No",
      "patreon": []
    };
  }
}

function saveData(data) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

app.get("/", (req, res) => {
  res.json({
    status: 200,
    message: "This is an API. You can not view it like a website. It is used for the admin and friend system.",
    dashboard: "/dashboard",
    serverdata: "/serverdata"
  });
});

app.get("/serverdata", (req, res) => {
  res.type("application/json").send(JSON.stringify(loadData(), null, 2));
});

app.get("/api/serverdata", (req, res) => {
  res.json(loadData());
});

app.get("/api/status", (req, res) => {
  const data = loadData();
  res.json({
    status: 200,
    online: true,
    menuVersion: data["menu-version"],
    minVersion: data["min-version"],
    minConsoleVersion: data["min-console-version"],
    adminCount: Array.isArray(data.admins) ? data.admins.length : 0,
    superAdminCount: Array.isArray(data["super-admins"]) ? data["super-admins"].length : 0,
    ownerCount: Array.isArray(data.owners) ? data.owners.length : 0
  });
});

/*
  Simple admin/data API for the dashboard.
  Set ADMIN_KEY before exposing this server publicly.
*/
function requireKey(req, res, next) {
  const key = process.env.ADMIN_KEY;
  if (!key) return res.status(503).json({ error: "ADMIN_KEY is not configured." });
  if (req.headers.authorization !== `Bearer ${key}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

app.put("/api/serverdata", requireKey, (req, res) => {
  if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
    return res.status(400).json({ error: "JSON object required." });
  }
  saveData(req.body);
  res.json({ status: 200, saved: true, data: req.body });
});

app.post("/ai", (req, res) => {
  res.status(501).json({
    status: 501,
    error: "AI provider is not configured in this standalone remake.",
    response: ""
  });
});

app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("*splat", (req, res) => {
  if (req.accepts("html")) {
    return res.sendFile(path.join(__dirname, "public", "index.html"));
  }
  res.status(404).json({ status: 404, error: "Not found" });
});

app.listen(PORT, () => {
  console.log(`Site/API running on http://localhost:${PORT}`);
});