const mongooes = require("mongoose");

module.exports.connect = async () => {
  try {
    mongooes.connect(process.env.MONGOO_URL);
    console.log("Connect OK");
  } catch (error) {
    console.log(`Connect Not OK ${error}`);
  }
};
