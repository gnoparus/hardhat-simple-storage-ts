import { ethers, run, network } from "hardhat";

async function main() {
  const simpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
  console.log("Deploying contract .....");
  const simpleStorage = await simpleStorageFactory.deploy();
  // console.log(simpleStorage);
  await simpleStorage.deployed();
  console.log(`Deployed contract to address: ${simpleStorage.address}`);

  if (network.config.chainId === 4 && process.env.ETHERSCAN_API_KEY) {
    console.log("Waiting for block confirmations...");
    await simpleStorage.deployTransaction.wait(6);
    await verify(simpleStorage.address, []);
  }

  const currentValue = await simpleStorage.retrieve();
  console.log(`currentValue = ${currentValue}`);

  const transactionResponse = await simpleStorage.store(555);
  await transactionResponse.wait(1);

  const currentValue2 = await simpleStorage.retrieve();
  console.log(`currentValue2 = ${currentValue2}`);
}

const verify = async (contractAddress: string, args: any[]) => {
  console.log("Verifying contract...");

  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (e: any) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already verfified");
    }
  }
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
