// scripts/deploy.js

async function main() {
  const [deployer] = await ethers.getSigners(); // Get the account to deploy the contract

  console.log("Deploying contracts with the account:", deployer.address);

  const BettingContract = await ethers.getContractFactory("BettingContract");
  const bettingContract = await BettingContract.deploy(10);

  // await numberCasino.deployed();

  console.log("MyContract deployed to:", bettingContract.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
