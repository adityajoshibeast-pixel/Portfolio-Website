const bcrypt = require("bcryptjs");

const plainPassword = "$2b$10$0Fu7ylviWFM9Nu76erMoTuaXHO4C1zMiFG5/RwyDCbuj3mv6/x75q";
const storedHash = "$2b$10$0Fu7ylviWFM9Nu76erMoTuaXHO4C1zMiFG5/RwyDCbuj3mv6/x75q";

bcrypt.compare(plainPassword, storedHash).then((result) => {
  console.log("Match:", result);
});