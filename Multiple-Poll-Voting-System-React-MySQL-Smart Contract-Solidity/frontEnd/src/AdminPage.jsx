import React, { useState, useEffect } from "react";
import Web3 from "web3";
import votingSystemAbi from "./contracts/DecentralizedVotingSystem.json";

const AdminPage = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [outcomeMessage, setOutcomeMessage] = useState("");
  const [pollName, setPollName] = useState("");
  const [candidates, setCandidates] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [pollResults, setPollResults] = useState([]);


  const contractAddress = "0x46c17F85055Ab67453374ce34FdA40d134DD53cc";

  const initializeWeb3 = async () => {
    try {
      const web3Instance = new Web3("http://127.0.0.1:7545");
      setWeb3(web3Instance);

      const deployedContract = new web3Instance.eth.Contract(
        votingSystemAbi.abi,
        contractAddress
      );
      setContract(deployedContract);
    } catch (error) {
      console.error("Error initializing Web3:", error);
    }
  };

  const handleCreatePoll = async () => {
    if (!web3 || !contract) {
      setFeedbackMessage("Web3 or contract not initialized!");
      return;
    }

    if (!pollName || !candidates) {
      setFeedbackMessage("Please enter a poll name and candidates.");
      return;
    }

    const candidatesArray = candidates.split(",").map((candidate) => candidate.trim());
    setIsLoading(true);
    try {
      const accounts = await web3.eth.getAccounts();
      await contract.methods.createPoll(pollName, candidatesArray).send({ from: accounts[0], gas: 5000000 });
      setFeedbackMessage(`Poll "${pollName}" created successfully!`);
      setPollName("");
      setCandidates("");
    } catch (error) {
      console.error("Error creating poll:", error);
      setFeedbackMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  /*const handleCheckOutcome = async () => {
    if (!web3 || !contract) {
      setOutcomeMessage("Web3 or contract not initialized!");
      return;
    }

    setIsLoading(true);
    try {

      const pollsCount = await contract.methods.getPollsCount().call();
      if (pollsCount === "0") {
        setOutcomeMessage("No polls have been created yet.");
        setIsLoading(false);
        return;
      }

      let allResults = [];
      for (let i = 0; i < pollsCount; i++) {
        const result = await contract.methods.getTopTwoWinners(i).call();
        allResults.push(`Poll ${i + 1}: ${result}`);
      }
  
      // Step 3: Display the results
      setOutcomeMessage(allResults.join("\n"));

      //const result = await contract.methods.getTopTwoWinners().call();
      //setOutcomeMessage(`Top Winners: ${result}`);
    } catch (error) {
      console.error("Error checking outcome:", error);
      setOutcomeMessage("Failed to retrieve the outcome.");
    } finally {
      setIsLoading(false);
    }
  };*/


  const handleCheckOutcome = async () => {
    if (!web3 || !contract) {
      setOutcomeMessage("Web3 or contract not initialized!");
      return;
    }
  
    setIsLoading(true);
    try {
      const pollsCount = await contract.methods.getPollsCount().call();
      if (pollsCount === "0") {
        setOutcomeMessage("No polls have been created yet.");
        setIsLoading(false);
        return;
      }
  
      let allResults = [];
      for (let i = 0; i < pollsCount; i++) {
        // Fetch the poll name
        const pollName = await contract.methods.getPollName(i).call(); // Assuming this method exists in your smart contract
  
        // Fetch the results of the poll
        const result = await contract.methods.getTopTwoWinners(i).call();
  
        // Add the result with the poll name
        allResults.push(`${pollName}: ${result}`);
      }
  
      // Display the results
      setOutcomeMessage(allResults.join("\n"));
    } catch (error) {
      console.error("Error checking outcome:", error);
      setOutcomeMessage("Failed to retrieve the outcome.");
    } finally {
      setIsLoading(false);
    }
  };
  
const getPollsCount = async () => {
    if (!web3 || !contract) {
      console.error("Web3 or contract is not initialized.");
      return;
    }
  
    try {
      const pollsCount = await contract.methods.getPollsCount().call();
      console.log(`Number of polls created: ${pollsCount}`);
    } catch (error) {
      console.error("Error fetching polls count:", error);
    }
  };
  
  // Call the function when the component is loaded or triggered
  getPollsCount();

  useEffect(() => {
    initializeWeb3();
  }, []);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Admin</h2>
      <p>Manage polls and check voting results below.</p>

      <div style={{ marginTop: "20px", border: "1px solid #ddd", padding: "15px", borderRadius: "5px" }}>
        <h3>Create a Poll</h3>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="poll-name">Poll Name:</label>
          <input
            type="text"
            id="poll-name"
            value={pollName}
            onChange={(e) => setPollName(e.target.value)}
            placeholder="Enter poll name"
            style={{ marginLeft: "10px", padding: "5px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="candidates">Candidates (comma-separated):</label>
          <input
            type="text"
            id="candidates"
            value={candidates}
            onChange={(e) => setCandidates(e.target.value)}
            placeholder="e.g., Anna, Eva, Jonathan"
            style={{ marginLeft: "10px", padding: "5px", width: "60%" }}
          />
        </div>
        <button
          style={{
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          onClick={handleCreatePoll}
          disabled={isLoading}
        >
          {isLoading ? "Creating..." : "Create Poll"}
        </button>
        <p style={{ marginTop: "10px", fontWeight: "bold", color: feedbackMessage.includes("successfully") ? "green" : "red" }}>
          {feedbackMessage}
        </p>
      </div>

      <div style={{ marginTop: "40px" }}>
  <h3>Check Voting Results</h3>
  <button
    style={{
      padding: "10px 20px",
      backgroundColor: "#f44336",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
    }}
    onClick={handleCheckOutcome}
    disabled={isLoading}
  >
    {isLoading ? "Fetching..." : "End"}
  </button>
  <p
    style={{
      marginTop: "10px",
      fontWeight: "bold",
      color: "blue",
      whiteSpace: "pre-wrap",
    }}
  >
    {outcomeMessage}
  </p>
</div>


    </div>
  );
};

export default AdminPage;
