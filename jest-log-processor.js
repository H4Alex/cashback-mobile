module.exports = (results) => {
  const fs = require("fs");
  const path = require("path");
  const logsDir = path.resolve(__dirname, "logs");
  fs.mkdirSync(logsDir, { recursive: true });
  fs.writeFileSync(
    path.join(logsDir, "all-results.json"),
    JSON.stringify(results, null, 2)
  );
  return results;
};
