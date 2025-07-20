const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying with account:", deployer.address);
 const balance = await ethers.provider.getBalance(await deployer.getAddress());
  console.log("Balance:", ethers.formatEther(balance), "XFI");

  const trustees = [deployer.address];

  const EduTechQuiz = await ethers.getContractFactory("EduTechQuiz");
  const contract = await EduTechQuiz.deploy(trustees, {
    maxPriorityFeePerGas: ethers.parseUnits("2", "gwei"),
    maxFeePerGas: ethers.parseUnits("3000", "gwei"),
  });



await contract.waitForDeployment();
console.log("Deployed at:", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
