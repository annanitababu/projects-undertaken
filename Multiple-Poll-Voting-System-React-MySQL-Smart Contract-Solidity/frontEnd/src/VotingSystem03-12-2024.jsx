import React, { useEffect, useState } from "react";
import Web3 from "web3";
import axios from "axios";

const VotingSystem = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [outcomeMessage, setOutcomeMessage] = useState("");


  // New state for giving voting rights
  const [voterAddress, setVoterAddress] = useState("");
  const [voterAge, setVoterAge] = useState("");
  const [isMember, setIsMember] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState("");


  // State to toggle Vote div visibility
  const [showVoteDiv, setShowVoteDiv] = useState(false);

  const contractABI = [
    
    {
      "inputs": [
        {
          "internalType": "string[]",
          "name": "proposalNames",
          "type": "string[]"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "chairpersonAddress",
          "type": "address"
        }
      ],
      "name": "ChairpersonLogged",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "chairperson",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "proposals",
      "outputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "voteCount",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalVoters",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalVotesCast",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "voterAddresses",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "voters",
      "outputs": [
        {
          "internalType": "bool",
          "name": "voted",
          "type": "bool"
        },
        {
          "internalType": "uint256",
          "name": "vote",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "age",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "isMember",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "voter",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "age",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "isMember",
          "type": "bool"
        }
      ],
      "name": "giveRightToVote",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "proposalIndex",
          "type": "uint256"
        }
      ],
      "name": "vote",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getProposalsCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "checkVotingOutcome",
      "outputs": [
        {
          "internalType": "string",
          "name": "outcome",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "resetVotes",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  
  ];
  const contractAddress = "0x3bD507936c7aea8457ab53821BA3bc99Dd9634C9"; // Replace with your deployed contract address

  useEffect(() => {
    const initializeWeb3 = async () => {
      try {
        const web3Instance = new Web3("http://127.0.0.1:7545");
        setWeb3(web3Instance);

        const loadedAccounts = await web3Instance.eth.getAccounts();
        setAccounts(loadedAccounts);

        const deployedContract = new web3Instance.eth.Contract(contractABI, contractAddress);
        setContract(deployedContract);

        const fetchProposals = async () => {
          const proposalCount = await deployedContract.methods.getProposalsCount().call();
          const fetchedProposals = [];
          for (let i = 0; i < proposalCount; i++) {
            const proposal = await deployedContract.methods.proposals(i).call();
            fetchedProposals.push(proposal.name);
          }
          setProposals(fetchedProposals);
        };

        fetchProposals();
      } catch (error) {
        console.error("Error initializing web3:", error);
      }
    };

    const fetchVoterDetails = async () => {
      try {
        const response = await axios.get("http://localhost:5000/voterdetails"); // API endpoint
        console.log(response);
        //const voterAddresses = response.data.map((voter) => voter.address);
        //setAccounts(voterAddresses);
      } catch (error) {
        console.error("Error fetching voter details:", error);
      }
    };


    initializeWeb3();
    fetchVoterDetails();
  }, []);

  const handleResetVotes = async () => {
    if (!web3 || !contract) {
      setStatusMessage("Web3 or contract not initialized!");
      return;
    }
  
    try {
      await contract.methods.resetVotes().send({ from: accounts[0], gas: 500000 });
      setStatusMessage("Voting reset successfully. Voters can revote.");
    } catch (error) {
      console.error("Error resetting votes:", error);
      setStatusMessage("Failed to reset votes. Try again.");
    }
  };
  

  const handleGiveVotingRights = async (e) => {
    e.preventDefault();
  
    if (!web3 || !contract) {
      setStatusMessage("Web3 or contract not initialized!");
      return;
    }

    if (!voterAddress) {
      setStatusMessage("Please select a voter address!");
      return;
    }
  
    if (!voterAge) {
      setStatusMessage("Please enter the voter's age!");
      return;
    }
  
    if (isNaN(voterAge) || voterAge <= 0) {
      setStatusMessage("Please enter a valid age greater than 0!");
      return;
    }
  
    if (!isMember) {
      setStatusMessage("Please confirm if the voter is a member of the community!");
      return;
    }
  
    if (!selectedCandidate) {
      setStatusMessage("Please select a candidate!");
      return;
    }
  
    try {
      await contract.methods
        .giveRightToVote(voterAddress, voterAge, isMember)
        .send({ from: accounts[0], gas: 500000 });
  
      setStatusMessage(`Voting rights granted successfully !`);
    } catch (error) {
      console.error("Error granting voting rights:", error);
      setStatusMessage("Failed to grant voting rights. Ensure all inputs are valid.");
    }
  };
  
  const handleVote = async (e) => {
    e.preventDefault();
  
    if (!web3 || !contract) {
      setStatusMessage("Web3 or contract not initialized!");
      return;
    }
  
    if (!voterAddress) {
      setStatusMessage("Please select a voter address!");
      return;
    }

    if (!voterAge) {
      setStatusMessage("Please enter the voter's age!");
      return;
    }
  
    if (isNaN(voterAge) || voterAge <= 18) {
      setStatusMessage("Please enter a valid age greater than 18!");
      return;
    }
  
    if (!isMember) {
      setStatusMessage("Please confirm if the voter is a member of the community!");
      return;
    }
  
    if (!selectedCandidate) {
      setStatusMessage("Please select a candidate!");
      return;
    }
  
    try {
      // Check if the voter has already voted
      const voterInfo = await contract.methods.voters(voterAddress).call();
  
      if (voterInfo.voted) {
        setStatusMessage("This voter has already voted.");
        return;
      }
  
      // Cast the vote
      await contract.methods
        .vote(selectedCandidate)
        .send({ from: voterAddress, gas: 500000 });

      const totalVotesCast = await contract.methods.totalVotesCast().call();
      const totalVoters = accounts.length-1;
  
      //setStatusMessage("Vote cast successfully!");

      // Update the status message to show the votes cast
      /*setStatusMessage(
        `${totalVotesCast.toString().padStart(2, "0")}/${accounts.length-1}`
      );*/

      // Format totalVotesCast and totalVoters to add a leading '0' for single-digit numbers
      const formattedVotesCast = totalVotesCast.toString().padStart(2, "0");
      const formattedTotalVoters = totalVoters.toString().padStart(2, "0");

      // Update the status message to show the formatted votes cast and total voters
      setStatusMessage(`${formattedVotesCast}/${formattedTotalVoters} votes casted successfully !!!`);
      //setStatusMessage(`Votes casted successfully !!!`);

    } catch (error) {
      console.error("Error during voting:", error);
      setStatusMessage("Failed to cast the vote. Ensure all inputs are valid.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // First, call `giveRightToVote`
    await handleGiveVotingRights(e);
  
    // Then, call the `vote` function
    await handleVote(e);
  };

  
  const handleCheckOutcome = async () => {
    if (!web3 || !contract) {
      setOutcomeMessage("Web3 or contract not initialized!");
      return;
    }

    try {
      // Call the `checkVotingOutcome` function from the contract
      const outcome = await contract.methods.checkVotingOutcome().call();
      setOutcomeMessage(outcome); // Display the outcome as a status message
    } catch (error) {
      console.error("Error checking voting outcome:", error);
      setOutcomeMessage("Failed to check the voting outcome. Please try again.");
    }
  };

  
  
  const formStyle = {
    margin: "20px 0px",
    padding: "10px",
    border: "1px solid rgb(14 79 219)",
    borderRadius: "22px",
    maxWidth: "400px",
  };

  const inputStyle = {
    display: "block",
    marginBottom: "10px",
    width: "100%",
    padding: "8px",
    fontSize: "14px",
  };

  const inputStyleVtage = {
    display: "block",
    marginBottom: "10px",
    width: "95%",
    padding: "8px",
    fontSize: "14px",
  };

  const centeredContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    textAlign: 'center',
    marginTop: '128px',
  };

  const topRightButtonStyle = {
    position: "absolute",
    top: "145px",
    //left: "62px",
    padding: "21px 49px",
    backgroundColor: "#4CAF50",
    transform: "translateX(-50%)", // Adjust to ensure exact centering
    color: "white",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
  };

  const bottomRightButtonStyle = {
    position: "fixed", // Fixed positioning to stick to the bottom
    bottom: "20px",    // Offset from the bottom
    left: "50%",       // Center horizontally
    transform: "translateX(-50%)", // Adjust to ensure exact centering
    padding: "21px 49px",
    backgroundColor: "#f44336", // Red for the End button
    color: "white",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
  };


  return (
    <div style={{ textAlign: "center", padding: "20px", position: "relative" }}>
      {!showVoteDiv && (
        <div>
          <button
            style={topRightButtonStyle}
            onClick={() => setShowVoteDiv(true)}
          >
            Start
          </button>
          <p style={{
        color: outcomeMessage.includes("successfully") ? "green" : "red",
        fontWeight: "bold",
        marginTop: "10px",
      }}
      >
        {outcomeMessage}
      </p>
    </div>
      )}
  
      {showVoteDiv && (
        <button
          style={{
            ...bottomRightButtonStyle,
            backgroundColor: "#f44336", // Red for the End button
          }}
          onClick={async () => {
            setShowVoteDiv(false); // Hide the voting UI
            await handleCheckOutcome(); // Check the voting outcome
            if (
              outcomeMessage.includes("Voting participation was less than 70%") ||
              outcomeMessage.includes("Winning margin is less than 5%")
            ) {
              await handleResetVotes(); // Reset votes if reinitiation is required
            }
          }}
        >
          End
        </button>
      )}
  
      <h1>Decentralized Voting System</h1>
  
      {showVoteDiv && (
        <div style={centeredContainerStyle}>
<form style={formStyle} onSubmit={handleSubmit}>
  <h3>
    {statusMessage === "" && "Please Enter Details"}
  </h3>
  <p
    style={{
      color: statusMessage.includes("successfully") ? "green" : "red",
      fontWeight: "bold",
    }}
  >
    {statusMessage}
  </p>

  {/* Dropdown for selecting Voter */}
  <select
    style={inputStyle}
    value={voterAddress}
    onChange={(e) => setVoterAddress(e.target.value)}
  >
    <option value="" disabled>
      Select Voter
    </option>
    {accounts.slice(1).map((account, index) => (
      <option key={index} value={account}>
        {account}
      </option>
    ))}
  </select>

  <input
    type="number"
    style={inputStyleVtage}
    placeholder="Enter Age"
    value={voterAge}
    onChange={(e) => setVoterAge(e.target.value)}
  />

  <label>
    <input
      type="checkbox"
      style={{ marginRight: "10px" }}
      checked={isMember}
      onChange={(e) => setIsMember(e.target.checked)}
    />
    Are you a Member of Community?
  </label>

  <br />

  {/* Dropdown for selecting Candidate */}
  <select
    style={inputStyle}
    value={selectedCandidate}
    onChange={(e) => setSelectedCandidate(e.target.value)}
  >
    <option value="" disabled>
      Select Candidate
    </option>
    {proposals.map((candidate, index) => (
      <option key={index} value={index}>
        {candidate}
      </option>
    ))}
  </select>

  <br />

  <button
    type="submit"
    style={{
      marginTop: "20px",
      padding: "10px 20px",
      fontSize: "16px",
      backgroundColor: "#4CAF50",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
    }}
  >
    Vote
  </button>
</form>


        </div>
      )}
    </div>
  );
  
};

export default VotingSystem;
