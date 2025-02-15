// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DecentralizedVotingSystem {
    struct Voter {
        bool voted;
        uint vote;
        uint age;
        bool isMember;
    }

    struct Proposal {
        string name;
        uint voteCount;
    }

    address public chairperson;
    mapping(address => Voter) public voters;
    Proposal[] public proposals;
    uint public totalVoters;
    uint public totalVotesCast;
    address[] public voterAddresses;

    event ChairpersonLogged(address chairpersonAddress);

    modifier onlyChairperson() {
        require(msg.sender == chairperson, "Only authority can execute this.");
        _;
    }

    constructor(string[] memory proposalNames) {
        chairperson = msg.sender;
        emit ChairpersonLogged(chairperson);
        for (uint i = 0; i < proposalNames.length; i++) {
            proposals.push(Proposal({
                name: proposalNames[i],
                voteCount: 0
            }));
        }
    }

    function giveRightToVote(address voter, uint age, bool isMember) public onlyChairperson {
        require(!voters[voter].voted, "The voter has already voted.");
        if (age >= 18 && isMember) {
            voters[voter] = Voter({
                voted: false,
                vote: 0,
                age: age,
                isMember: isMember
            });
            totalVoters++;
            voterAddresses.push(voter);
        } else {
            revert("Voter is not eligible to vote. Must be at least 18 years old and a community member.");
        }
    }

    function vote(uint proposalIndex) public {
        Voter storage sender = voters[msg.sender];
        require(!sender.voted, "You have already voted.");
        require(proposalIndex < proposals.length, "Invalid proposal index.");
        sender.voted = true;
        sender.vote = proposalIndex;
        totalVotesCast++;
        proposals[proposalIndex].voteCount += 1;
    }

    function getProposalsCount() public view returns (uint) {
        return proposals.length;
    }

    function checkVotingOutcome() public view returns (string memory outcome) {
        uint participationPercentage = (totalVotesCast * 100) / totalVoters;

        // Condition 1: If participation is less than 70%
        if (participationPercentage < 70) {
            return "Voting participation was less than 70%. Voting needs to be reinitiated.";
        }

        uint winningVoteCount = 0;
        uint secondWinningVoteCount = 0;
        uint winningProposalIndex = 0;

        // Determine the winning proposal
        for (uint i = 0; i < proposals.length; i++) {
            if (proposals[i].voteCount > winningVoteCount) {
                secondWinningVoteCount = winningVoteCount;
                winningVoteCount = proposals[i].voteCount;
                winningProposalIndex = i;
            } else if (proposals[i].voteCount > secondWinningVoteCount) {
                secondWinningVoteCount = proposals[i].voteCount;
            }
        }

        // Condition 2: If margin of victory is less than 5%
        uint marginOfVictory = ((winningVoteCount - secondWinningVoteCount) * 100) / totalVotesCast;
        if (marginOfVictory < 5) {
            return "Winning margin is less than 5%. Voting needs to be reinitiated.";
        }

        // Return the winner's name only when both conditions are satisfied
        return string(abi.encodePacked("The winner is: ", proposals[winningProposalIndex].name));
    }

    
    function resetVotes() public onlyChairperson {
        for (uint i = 0; i < voterAddresses.length; i++) {
            voters[voterAddresses[i]].voted = false;
            voters[voterAddresses[i]].vote = 0;
        }
        for (uint i = 0; i < proposals.length; i++) {
            proposals[i].voteCount = 0;
        }
    }



    function getTopTwoWinners() public view returns (string memory result) {
    uint firstMax = 0;
    uint secondMax = 0;
    uint firstWinnerIndex = 0;
    uint secondWinnerIndex = 0;

    // Step 1: Calculate Voting Participation Percentage
    uint participationPercentage = (totalVotesCast * 100) / totalVoters;

    // Condition: If participation is less than 70%
    if (participationPercentage < 70) {
        return "Voting participation was less than 70%. Voting needs to be reinitiated.";
    }

    // Step 2: Determine the top two winners
    for (uint i = 0; i < proposals.length; i++) {
        if (proposals[i].voteCount > firstMax) {
            secondMax = firstMax;
            secondWinnerIndex = firstWinnerIndex;
            firstMax = proposals[i].voteCount;
            firstWinnerIndex = i;
        } else if (proposals[i].voteCount > secondMax) {
            secondMax = proposals[i].voteCount;
            secondWinnerIndex = i;
        }
    }

    // Step 3: Calculate Winning Margin
    uint marginOfVictory = ((firstMax - secondMax) * 100) / totalVotesCast;
    if (marginOfVictory < 5) {
        return "Winning margin is less than 5%. Voting needs to be reinitiated.";
    }

    // Step 4: Return the top two winners and total votes if conditions are satisfied
    return string(
        abi.encodePacked(
            "First Winner: ", proposals[firstWinnerIndex].name,
            " (Votes: ", uintToString(firstMax), "), ",
            "Second Winner: ", proposals[secondWinnerIndex].name,
            " (Votes: ", uintToString(secondMax), ") "
        )
    );
}


    // Utility function to convert uint to string
    function uintToString(uint v) internal pure returns (string memory) {
        if (v == 0) {
            return "0";
        }
        uint digits;
        uint temp = v;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (v != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + v % 10));
            v /= 10;
        }
        return string(buffer);
    }

}