// postinstall.js
const fs = require("fs");
const path = require("path");

const defaultConfigPath = path.join(__dirname, "icon.config.js");
const userConfigPath = path.join(process.cwd(), "icon.config.js");

if (!fs.existsSync(userConfigPath)) {
    fs.copyFileSync(defaultConfigPath, userConfigPath);
    console.log("Default icon.config.js has been created in your project root.");
} else {
    console.log("icon.config.js already exists in your project root.");
}
