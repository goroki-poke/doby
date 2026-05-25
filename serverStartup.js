const { log_manager } = require("./startupLogs.js");

function startLoggingErrors() {
  try {
    // console.log("Starting Error Logging...");
    eval(log_manager());
  } catch (err) {
    // console.log(err)
    // console.log("Interrupted Error Logging...");
  }
}

module.exports = { startLoggingErrors };
