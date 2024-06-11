// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract BettingContract {
    struct Bet {
        uint8 number;
        uint256 amount;
    }
    address payable public owner;
    uint256 public betFee;
    uint256 public totalBetAmount;
    bool public bettingOpen;
    mapping(address => Bet) public bets;
    mapping(address => uint256) public rewards;

    address[] public betters;
    event BetPlaced(address indexed player, uint8 number, uint256 amount);
    event RewardsDistributed(uint8 winningNumber);
    event WinnerAnnounced(address indexed winner, uint8 winningNumber);
    event BettingStarted();
    event bettingEnded(uint256 winningNumber);
    event WinningsWithdrawn(address winner, uint256 amount);

    constructor(uint256 _betFee) {
        owner = payable(msg.sender);
        betFee = _betFee;
        bettingOpen = false;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform");
        _;
    }
    modifier bettingOpenOnly() {
        require(bettingOpen, "Betting is not open");
        _;
    }

    function getRandomNumber() private view returns (uint256) {
        return
            (uint256(
                keccak256(
                    abi.encodePacked(
                        block.timestamp,
                        block.prevrandao,
                        msg.sender
                    )
                )
            ) % 10) + 1;
    }
    function startBetting() public onlyOwner {
        require(!bettingOpen, "Betting is already open");
        bettingOpen = true;
        emit BettingStarted();
    }

    function endBetting() public onlyOwner bettingOpenOnly {
        bettingOpen = false;
        uint256 winningNumber = getRandomNumber();
        distributeRewards(winningNumber);
        emit bettingEnded(winningNumber);
    }

    function bet(uint8 _number) public payable bettingOpenOnly {
        require(msg.value > 0, "Bet amount must be greater than zero.");

        if (bets[msg.sender].amount == 0) {
            betters.push(msg.sender);
        }
        bets[msg.sender] = Bet({amount: msg.value, number: _number});
        totalBetAmount += msg.value;
        emit BetPlaced(msg.sender, _number, msg.value);
    }
    function distributeRewards(uint _winningNumber) private {
        uint256 ownerTotalFee = (totalBetAmount * betFee) / 100;
        uint256 distributedAmount = totalBetAmount - ownerTotalFee;
        uint256 totalWinningBets = 0;

        for (uint256 i = 0; i < betters.length; i++) {
            if (bets[betters[i]].number == _winningNumber) {
                totalWinningBets += bets[betters[i]].amount;
            }
        }

        if (totalWinningBets > 0) {
            // Distribute rewards to winners
            for (uint256 i = 0; i < betters.length; i++) {
                if (bets[betters[i]].number == _winningNumber) {
                    uint256 reward = (bets[betters[i]].amount *
                        distributedAmount) / totalWinningBets;
                    rewards[betters[i]] += reward;
                }
            }
        }

        // Transfer fee to the owner
        owner.transfer(ownerTotalFee);

        // Clear all bets and reset total bet amount
        for (uint256 i = 0; i < betters.length; i++) {
            delete bets[betters[i]];
        }
        delete betters;
        totalBetAmount = 0;
    }

    function withdrawReward() public {
        uint256 reward = rewards[msg.sender];
        require(reward > 0, "No rewards to withdraw");
        rewards[msg.sender] = 0;
        payable(msg.sender).transfer(reward);
        emit WinningsWithdrawn(msg.sender, reward);
    }
}
