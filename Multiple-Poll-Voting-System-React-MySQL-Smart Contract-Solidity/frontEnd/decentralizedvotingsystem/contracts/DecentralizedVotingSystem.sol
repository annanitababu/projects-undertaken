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

    struct Poll {
        string name;
        Proposal[] proposals;
        mapping(address => Voter) voters;
        address[] voterAddresses;
        uint totalVoters;
        uint totalVotesCast;
    }

    address public chairperson;
    Poll[] public polls;

    event ChairpersonLogged(address chairpersonAddress);
    event PollCreated(uint pollId, string pollName);

    modifier onlyChairperson() {
        require(msg.sender == chairperson, "Only chairperson can execute this.");
        _;
    }

    constructor() {
        chairperson = msg.sender;
        emit ChairpersonLogged(chairperson);
    }

    // Function to create a new poll
    function createPoll(string memory pollName, string[] memory proposalNames) public onlyChairperson {
        Poll storage newPoll = polls.push();
        newPoll.name = pollName;
        for (uint i = 0; i < proposalNames.length; i++) {
            newPoll.proposals.push(Proposal({
                name: proposalNames[i],
                voteCount: 0
            }));
        }
        emit PollCreated(polls.length - 1, pollName);
    }

    // Function to give a voter the right to vote in a specific poll
    function giveRightToVote(uint pollId, address voter, uint age, bool isMember) public onlyChairperson {
        require(pollId < polls.length, "Invalid poll ID.");
        Poll storage poll = polls[pollId];
        require(!poll.voters[voter].voted, "The voter has already voted.");
        if (age >= 18 && isMember) {
            poll.voters[voter] = Voter({
                voted: false,
                vote: 0,
                age: age,
                isMember: isMember
            });
            poll.totalVoters++;
            poll.voterAddresses.push(voter);
        } else {
            revert("Voter is not eligible to vote. Must be at least 18 years old and a community member.");
        }
    }

    // Function for voters to cast their vote in a specific poll
    function vote(uint pollId, uint proposalIndex) public {
        require(pollId < polls.length, "Invalid poll ID.");
        Poll storage poll = polls[pollId];
        Voter storage sender = poll.voters[msg.sender];
        require(!sender.voted, "You have already voted.");
        require(proposalIndex < poll.proposals.length, "Invalid proposal index.");
        sender.voted = true;
        sender.vote = proposalIndex;
        poll.totalVotesCast++;
        poll.proposals[proposalIndex].voteCount++;
    }

    // Function to check voting outcome for a specific poll
    function checkVotingOutcome(uint pollId) public view returns (string memory outcome) {
        require(pollId < polls.length, "Invalid poll ID.");
        Poll storage poll = polls[pollId];
        uint participationPercentage = (poll.totalVotesCast * 100) / poll.totalVoters;

        // Condition 1: If participation is less than 70%
        if (participationPercentage < 70) {
            return "Voting participation was less than 70%. Voting needs to be reinitiated.";
        }

        uint winningVoteCount = 0;
        uint secondWinningVoteCount = 0;
        uint winningProposalIndex = 0;

        // Determine the winning proposal
        for (uint i = 0; i < poll.proposals.length; i++) {
            if (poll.proposals[i].voteCount > winningVoteCount) {
                secondWinningVoteCount = winningVoteCount;
                winningVoteCount = poll.proposals[i].voteCount;
                winningProposalIndex = i;
            } else if (poll.proposals[i].voteCount > secondWinningVoteCount) {
                secondWinningVoteCount = poll.proposals[i].voteCount;
            }
        }

        // Condition 2: If margin of victory is less than 5%
        uint marginOfVictory = ((winningVoteCount - secondWinningVoteCount) * 100) / poll.totalVotesCast;
        if (marginOfVictory < 5) {
            return "Winning margin is less than 5%. Voting needs to be reinitiated.";
        }

        return string(abi.encodePacked("The winner is: ", poll.proposals[winningProposalIndex].name));
    }

    // Function to reset votes for a specific poll
    function resetVotes(uint pollId) public onlyChairperson {
        require(pollId < polls.length, "Invalid poll ID.");
        Poll storage poll = polls[pollId];
        for (uint i = 0; i < poll.voterAddresses.length; i++) {
            poll.voters[poll.voterAddresses[i]].voted = false;
            poll.voters[poll.voterAddresses[i]].vote = 0;
        }
        for (uint i = 0; i < poll.proposals.length; i++) {
            poll.proposals[i].voteCount = 0;
        }
        poll.totalVotesCast = 0;
    }

    // Function to get the number of polls
    function getPollsCount() public view returns (uint) {
        return polls.length;
    }

    function getTopTwoWinners(uint pollId) public view returns (string memory result) {
        require(pollId < polls.length, "Invalid poll ID.");
        Poll storage poll = polls[pollId];

        uint firstMax = 0;
        uint secondMax = 0;
        uint firstWinnerIndex = 0;
        uint secondWinnerIndex = 0;

        // Step 1: Calculate Voting Participation Percentage
        uint participationPercentage = (poll.totalVotesCast * 100) / poll.totalVoters;

        // Condition: If participation is less than 70%
        if (participationPercentage < 70) {
            return "Voting participation was less than 70%. Voting needs to be reinitiated.";
        }

        // Step 2: Determine the top two winners
        for (uint i = 0; i < poll.proposals.length; i++) {
            if (poll.proposals[i].voteCount > firstMax) {
                secondMax = firstMax;
                secondWinnerIndex = firstWinnerIndex;
                firstMax = poll.proposals[i].voteCount;
                firstWinnerIndex = i;
            } else if (poll.proposals[i].voteCount > secondMax) {
                secondMax = poll.proposals[i].voteCount;
                secondWinnerIndex = i;
            }
        }

        // Step 3: Calculate Winning Margin
        uint marginOfVictory = ((firstMax - secondMax) * 100) / poll.totalVotesCast;
        if (marginOfVictory < 5) {
            return "Winning margin is less than 5%. Voting needs to be reinitiated.";
        }

        // Step 4: Return the top two winners and total votes if conditions are satisfied
        return string(
            abi.encodePacked(
                "First Winner: ", poll.proposals[firstWinnerIndex].name,
                " (Votes: ", uintToString(firstMax), "), ",
                "Second Winner: ", poll.proposals[secondWinnerIndex].name,
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

    // Function to get proposal names for a specific poll
    function getProposalName(uint pollId, uint proposalIndex) public view returns (string memory) {
        require(pollId < polls.length, "Invalid poll ID.");
        require(proposalIndex < polls[pollId].proposals.length, "Invalid proposal index.");
        return polls[pollId].proposals[proposalIndex].name;
    }

    // Function to get the number of proposals for a specific poll
    function getProposalsCount(uint pollId) public view returns (uint) {
        require(pollId < polls.length, "Invalid poll ID.");
        return polls[pollId].proposals.length;
    }

    function getPollDetails(uint pollId) public view returns (string memory pollName, string memory result) {
        require(pollId < polls.length, "Invalid poll ID.");
        Poll storage poll = polls[pollId];
        pollName = poll.name;
        result = getTopTwoWinners(pollId);
        return (pollName, result);
    }

    function getPollName(uint index) public view returns (string memory) {
        return polls[index].name; // Assuming `polls` is an array of Poll structs
    }

}
