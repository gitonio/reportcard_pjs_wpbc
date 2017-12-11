var School = artifacts.require("./School.sol");
var ReportCard = artifacts.require("./ReportCard");
module.exports = function(deployer) {
  deployer.deploy(School, 'Test School');
  deployer.deploy(ReportCard, 0x1, 'Test Student');
};
