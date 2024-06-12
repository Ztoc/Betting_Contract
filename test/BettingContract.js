const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("BettingContract", function () {
  let BettingContract, bettingContract, owner, addr1, addr2;
  async function deployTokenFixture() {
    BettingContract = await ethers.getContractFactory("BettingContract");
    [owner, addr1, addr2, addr3, ...addrs] = await ethers.getSigners();
    bettingContract = await BettingContract.deploy();
    return { bettingContract, owner, addr1, addr2, addr3, ...addrs };
  }

  describe("Deployment", async function () {
    const { bettingContract, addr1, addr2, owner } = await loadFixture(deployTokenFixture);
    it("Shoud set the right owner", async function () {
      expect(await bettingContract.owner()).to.equal(owner.address);
    });
    it("Should start with betting closed", async function () {
      expect(await bettingContract.bettingOpen()).to.be.false;
    });
  });

  describe("Betting", async function () {
    const { bettingContract, addr1, addr2, owner } = await loadFixture(deployTokenFixture);

    it("Should allow users to place bets", async function () {
      await bettingContract.startBetting();

      await bettingContract.connect(addr1).bet(5, { value: ethers.utils.parseEther("1") });
      const bet = await bettingContract.bets(addr1.address);
      expect(bet.number).to.equal(5);
      expect(bet.amount.toString()).to.equal(ethers.utils.parseEther("1").toString());
    });

    it("Should not allow betting if betting is closed", async function () {
      await bettingContract.startBetting();

      // End betting
      await bettingContract.endBetting();

      await expect(bettingContract.connect(addr1).bet(5, { value: ethers.utils.parseEther("1") })).to.be.revertedWith(
        "Betting is not open"
      );
    });
    it("Should distribute rewards correctly", async function () {
      // Place bets
      await bettingContract.connect(addr1).bet(5, { value: ethers.utils.parseEther("1") });
      await bettingContract.connect(addr2).bet(6, { value: ethers.utils.parseEther("2") });

      // End betting (will trigger reward distribution based on `getRandomNumber`)
      await bettingContract.endBetting();

      // Withdraw reward for addr1 (if winner)
      const reward = await bettingContract.rewards(addr1.address);
      if (reward > 0) {
        await bettingContract.connect(addr1).withdrawReward();
        expect(await ethers.provider.getBalance(addr1.address)).to.be.above(reward);
      }

      // Withdraw reward for addr2 (if winner)
      const reward2 = await bettingContract.rewards(addr2.address);
      if (reward2 > 0) {
        await bettingContract.connect(addr2).withdrawReward();
        expect(await ethers.provider.getBalance(addr2.address)).to.be.above(reward2);
      }
    });
  });
  describe("Owner functions", async function () {
    const { bettingContract, addr1, addr2, owner } = await loadFixture(deployTokenFixture);

    it("Should allow only owner to start betting", async function () {
      await expect(bettingContract.connect(addr1).startBetting()).to.be.revertedWith("Only the owner can perform");
    });

    it("Should allow only owner to end betting", async function () {
      await bettingContract.startBetting();
      await expect(bettingContract.connect(addr1).endBetting()).to.be.revertedWith("Only the owner can perform");
    });
  });
});
