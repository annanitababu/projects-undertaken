import React, { useEffect, useState } from "react";
import Web3 from "web3";
import axios from "axios";
import { useNavigate } from "react-router-dom";


import votingSystemAbi from "./contracts/DecentralizedVotingSystem.json";

const contractABI = votingSystemAbi.abi;


const VotingSystem = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [outcomeMessage, setOutcomeMessage] = useState("");

  const navigate = useNavigate();


  const [selectedCandidate, setSelectedCandidate] = useState("");


  const contractAddress = "0x142ae531e193e0bF8ecc61f02E49c93c596438E9"; // Replace with your deployed contract address

  useEffect(() => {
    const initializeWeb3 = async () => {
      try {
        const web3Instance = new Web3("http://127.0.0.1:7545");
        setWeb3(web3Instance);

        const loadedAccounts = await web3Instance.eth.getAccounts();
        setAccounts(loadedAccounts);

        const deployedContract = new web3Instance.eth.Contract(
          contractABI,
          contractAddress
        );
        setContract(deployedContract);

        const fetchProposals = async () => {
          const proposalCount = await deployedContract.methods
            .getProposalsCount()
            .call();
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

    initializeWeb3();

    const voterAddress = localStorage.getItem("voteraddr");
    if (!voterAddress) {
        // If voter address is not found, redirect to login
        navigate("/");
    }

    const initializeContract = async () => {
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
        console.error("Error initializing contract:", error);
      }
    };
  
    initializeContract();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //await handleVote(e);
      const voterIndex = accounts.indexOf(localStorage.getItem("voteraddr")); // Find voter index if stored in accounts
        const i = voterIndex !== -1 ? voterIndex : 0; // Default to 0 if not found
        await handleVote(e, i);
    } catch (error) {
      console.error("Error handling submit:", error);
    }
  };

  const handleLogout = () => {
    // Clear any stored user data (optional)
    localStorage.clear(); // or sessionStorage.clear();
  
    // Redirect to the Login page
    navigate("/");
  };

  const handleVote = async (e, i) => {
    e.preventDefault();

    const voterAddress = localStorage.getItem("voteraddr");
    if (!voterAddress) {
      console.error("Voter address not found in localStorage!");
      return;
    }

    const ganacheAccounts = await web3.eth.getAccounts();

    const chairperson = ganacheAccounts[0]; // Assuming the first account is the chairperson


    if (!web3 || !contract) {
      setStatusMessage("Web3 or contract not initialized!");
      return;
    }
  
    if (selectedCandidate === "") {
      setStatusMessage("Please select a candidate to vote for.");
      return;
    }
  
    try {

        await contract.methods.giveRightToVote(voterAddress, 25, true).send({
          from: chairperson,
          gas: 500000,
        });
        console.log(`Voting rights granted to: ${voterAddress}`);
      
      // Call the vote function on the smart contract
      await contract.methods.vote(selectedCandidate).send({
        //from: i === 0 ? accounts[0] : voterAddress, // Conditional selection
        from: voterAddress, // Conditional selection
        gas: 500000, // Gas limit for the transaction
      });
  
      setStatusMessage("You have successfully voted!"); // Success message
    } catch (error) {
      console.error("Error during voting:", error);
      setStatusMessage("Failed to cast vote. Please try again.");
    }
  };
  
  const handleCheckOutcome = async (e) => {
    if (!web3 || !contract) {
        setOutcomeMessage("Web3 or contract not initialized!");
        return;
    }

    try {

        const voterAddress = localStorage.getItem("voteraddr");
        console.log('voterAddress =============>',voterAddress);
        if (!voterAddress) {
          console.error("Voter address not found in localStorage!");
          return;
        }
        
        // Call the smart contract function
       const result = await contract.methods.getTopTwoWinners().call();
       console.log("Result from contract:", result);
        
        // Update the outcome message
       setOutcomeMessage(result);
    } catch (error) {
        console.error("Error checking outcome:", error);
        setOutcomeMessage("Failed to retrieve the outcome.");
    }
};


  
  
  
  
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

  const formStyle = {
    margin: "20px 0px",
    padding: "20px",
    border: "1px solid rgb(14 79 219)",
    borderRadius: "22px",
    maxWidth: "400px",
    backgroundColor: "#f9f9f9",
  };

  const inputStyle = {
    display: "block",
    marginBottom: "10px",
    width: "100%",
    padding: "8px",
    fontSize: "14px",
  };

  const pageStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#eef2f3",
    textAlign: "center",
  };

  const bottomRightButtonStyle = {
    position: "fixed",
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    padding: "20px 50px",
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
  };

  return (
    <div style={pageStyle}>
      <form style={formStyle} onSubmit={handleSubmit}>
        <h3></h3>
        <p
          style={{
            color: statusMessage.includes("successfully") ? "green" : "red",
            fontWeight: "bold",
          }}
        >
          {statusMessage}
        </p>
        <select
          style={inputStyle}
          value={selectedCandidate}
          onChange={(e) => setSelectedCandidate(e.target.value)}
        >
          <option value="" disabled>
            Select MLA
          </option>
          {proposals.map((candidate, index) => (
            <option key={index} value={index}>
              {candidate}
            </option>
          ))}
        </select>
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
        <button
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginLeft: "10px"
          }}
          onClick={handleLogout}
        >
        Exit
        </button>

      </form>

      <div>
  <h3>Voting Outcome</h3>
  <p style={{ fontWeight: "bold", color: "blue" }}>{outcomeMessage}</p>
</div>


      <button
        style={bottomRightButtonStyle}
        onClick={async () => {
          await handleCheckOutcome();
        }}
        >
        End
      </button>
    </div>
    
  );
};

export default VotingSystem;
