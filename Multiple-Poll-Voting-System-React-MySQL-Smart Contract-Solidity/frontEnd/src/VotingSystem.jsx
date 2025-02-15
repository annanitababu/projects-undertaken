import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { useNavigate } from "react-router-dom";
import votingSystemAbi from "./contracts/DecentralizedVotingSystem.json";

const contractABI = votingSystemAbi.abi;

const VotingSystem = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [polls, setPolls] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [selectedPoll, setSelectedPoll] = useState("");
  const [selectedProposal, setSelectedProposal] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const contractAddress = "0x46c17F85055Ab67453374ce34FdA40d134DD53cc"; // Replace with your deployed contract address
  const navigate = useNavigate();

  // Initialize Web3 and fetch polls
  useEffect(() => {
    const initializeWeb3 = async () => {
      try {
        const web3Instance = new Web3("http://127.0.0.1:7545");
        setWeb3(web3Instance);

        const accounts = await web3Instance.eth.getAccounts();
        setAccounts(accounts);

        const deployedContract = new web3Instance.eth.Contract(contractABI, contractAddress);
        setContract(deployedContract);

        // Fetch polls
        const fetchPolls = async () => {
          const pollCount = await deployedContract.methods.getPollsCount().call();
          const fetchedPolls = [];
          for (let i = 0; i < pollCount; i++) {
            const poll = await deployedContract.methods.polls(i).call();
            fetchedPolls.push(poll.name);
          }
          setPolls(fetchedPolls);
        };

        await fetchPolls();
      } catch (error) {
        console.error("Error initializing web3:", error);
      }
    };

    initializeWeb3();

    // Ensure voter is logged in
    const voterAddress = localStorage.getItem("voteraddr");
    if (!voterAddress) navigate("/");
  }, []);

  const fetchProposals = async (pollId) => {
    try {
      const proposalCount = await contract.methods.getProposalsCount(pollId).call();
      const fetchedProposals = [];
      for (let i = 0; i < proposalCount; i++) {
        const proposalName = await contract.methods.getProposalName(pollId, i).call();
        fetchedProposals.push(proposalName);
      }
      setProposals(fetchedProposals);
    } catch (error) {
      console.error("Error fetching proposals:", error);
    }
  };

  // Handle poll change
  const handlePollChange = async (e) => {
    const pollId = e.target.value;
    setSelectedPoll(pollId);
    await fetchProposals(pollId); // Fetch proposals for the selected poll
  };

  // Handle vote
  const handleVote = async (e) => {
    e.preventDefault();
    if (!selectedPoll || !selectedProposal) {
      setStatusMessage("Please select a poll and proposal.");
      return;
    }

    const voterAddress = localStorage.getItem("voteraddr");
    if (!voterAddress || !web3 || !contract) {
      setStatusMessage("Web3, contract, or voter address not initialized.");
      return;
    }

    const ganacheAccounts = await web3.eth.getAccounts();

    const chairperson = ganacheAccounts[0]; // Assuming the first account is the chairperson

    try {

      await contract.methods
        .giveRightToVote(selectedPoll, voterAddress, 25, true)
        .send({
          from: chairperson,
          gas: 500000,
      });

      console.log(`Voting rights granted to: ${voterAddress}`);


      await contract.methods.vote(selectedPoll, selectedProposal).send({
        from: voterAddress,
        gas: 500000,
      });
      console.log("Selected Poll:", selectedPoll);
      console.log("Selected Proposal:", selectedProposal);
      console.log("Voter Address:", voterAddress);

      setStatusMessage("Vote successfully cast!");
    } catch (error) {
      console.error("Error casting vote:", error);
      setStatusMessage("Failed to cast vote.");
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const inputStyle = {
    display: "block",
    marginBottom: "15px",
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

  const formStyle = {
    margin: "20px auto",
    padding: "40px",
    border: "1px solid rgb(14 79 219)",
    borderRadius: "22px",
    maxWidth: "500px", // Increase the maximum width of the form
    backgroundColor: "#f9f9f9",
    textAlign: "center", // Center-align the text inside the form
  };

  const formRowStyle = {
    display: "flex",
    alignItems: "center",
    flexDirection: "column", // Stack items vertically
    marginBottom: "15px",
  };

  const labelStyle = {
    fontSize: "16px",
    fontWeight: "bold",
    marginBottom: "5px",
    textAlign: "center",
  };

  return (
    <div style={pageStyle}>
      <form style={formStyle} onSubmit={handleVote}>
        <p
          style={{
            color: statusMessage.includes("successfully") ? "green" : "red",
            fontWeight: "bold",
          }}
        >
          {statusMessage}
        </p>

        {/* Poll Dropdown */}
        <div style={formRowStyle}>
        <label style={labelStyle}>Poll</label>
        <select
          onChange={handlePollChange}
          style={inputStyle}
          value={selectedPoll}
        >
          <option value="" disabled>
            Select a Poll
          </option>
          {polls.map((poll, index) => (
            <option key={index} value={index}>
              {poll}
            </option>
          ))}
        </select>
      </div>

        {/* Proposals Dropdown */}
        {proposals.length > 0 && (
        <div style={formRowStyle}>
          <label style={labelStyle}>Candidates</label>
          <select
            onChange={(e) => setSelectedProposal(e.target.value)}
            style={inputStyle}
            value={selectedProposal}
          >
            <option value="" disabled>
              Select a Proposal
            </option>
            {proposals.map((proposal, index) => (
              <option key={index} value={index}>
                {proposal}
              </option>
            ))}
          </select>
        </div>
      )}

        {/* Submit Button */}
        <button type="submit"
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}>
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
    </div>
  );
};

export default VotingSystem;
