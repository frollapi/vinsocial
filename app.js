// 👉 VinSocial App.js - Updated: Show Balance + Full Registration Form

const vinSocialAddress = "0x2DB5a0Dcf2942d552EF02D683b4d5852A7431a87";
const vinTokenAddress = "0x941F63807401efCE8afe3C9d88d368bAA287Fac4";

let provider, signer, userAddress;
let vinSocialContract, vinTokenContract;

const vinSocialAbi = [
  "function registered(address) view returns (bool)",
  "function REGISTRATION_FEE() view returns (uint256)",
  "function register(string,string,string,string) external",
  "function createPost(string,string,string) external",
  "function getUserPosts(address) view returns (uint256[])",
  "function posts(uint256) view returns (address,string,string,string,uint256)",
  "function likePost(uint256) external",
  "function commentOnPost(uint256,string) external",
  "function getComments(uint256) view returns (tuple(address commenter, string message, uint256 timestamp)[])"
];

const vinTokenAbi = [
  "function balanceOf(address) view returns (uint256)",
  "function allowance(address,address) view returns (uint256)",
  "function estimateFee(uint256) view returns (uint256)",
  "function transferFrom(address,address,uint256) returns (bool)"
];

// Connect wallet
async function connectWallet() {
  if (!window.ethereum) {
    alert("Please install MetaMask to use VinSocial.");
    return;
  }
  provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  signer = provider.getSigner();
  userAddress = await signer.getAddress();
  document.getElementById("status").innerText = "Connected: " + userAddress;
  vinSocialContract = new ethers.Contract(vinSocialAddress, vinSocialAbi, signer);
  vinTokenContract = new ethers.Contract(vinTokenAddress, vinTokenAbi, signer);
  await checkRegistration();
  await showBalances();
}

// Show VIN and VIC balance
async function showBalances() {
  try {
    const vinBal = await vinTokenContract.balanceOf(userAddress);
    const vicBal = await provider.getBalance(userAddress);
    const vin = parseFloat(ethers.utils.formatUnits(vinBal, 18)).toFixed(3);
    const vic = parseFloat(ethers.utils.formatEther(vicBal)).toFixed(5);
    document.getElementById("balances").innerText = `Balance: ${vin} VIN | ${vic} VIC`;
  } catch (err) {
    console.error("Balance fetch failed:", err);
    document.getElementById("balances").innerText = "Balance: --";
  }
}

// Check registration and toggle UI
async function checkRegistration() {
  try {
    const isRegistered = await vinSocialContract.registered(userAddress);
    if (isRegistered) {
      document.getElementById("mainApp").style.display = "block";
      document.getElementById("registrationForm").style.display = "none";
      loadPosts();
    } else {
      document.getElementById("mainApp").style.display = "none";
      document.getElementById("registrationForm").style.display = "block";
      document.getElementById("status").innerText += "\nYou are not registered. Please complete the form below.";
    }
  } catch (err) {
    console.error("Registration check failed:", err);
    document.getElementById("status").innerText = "Error connecting to contract.";
  }
}

// Submit registration from form
async function handleFormSubmission(e) {
  e.preventDefault();
  const name = document.getElementById("regName").value.trim();
  const bio = document.getElementById("regBio").value.trim();
  const avatar = document.getElementById("regAvatar").value.trim();
  const website = document.getElementById("regWebsite").value.trim();

  if (name.length < 3 || name.length > 30) {
    alert("Display name must be between 3 and 30 characters.");
    return;
  }

  try {
    const regFee = await vinSocialContract.REGISTRATION_FEE();
    const estFee = await vinTokenContract.estimateFee(regFee);
    const total = regFee.add(estFee);
    const allowance = await vinTokenContract.allowance(userAddress, vinSocialAddress);
    if (allowance.lt(total)) {
      alert("Insufficient allowance. Please approve 0.05 VIN + fee to register.");
      return;
    }
    const tx = await vinSocialContract.register(name, bio, avatar, website);
    await tx.wait();
    alert("Registration successful! Reloading...");
    location.reload();
  } catch (err) {
    console.error("Registration error:", err);
    alert("Registration failed.");
  }
}

// Create post
async function createPost() {
  const title = document.getElementById("postTitle").value;
  const content = document.getElementById("postContent").value;
  const media = document.getElementById("postMedia").value;

  if (!title || !content) {
    alert("Please enter both title and content.");
    return;
  }

  try {
    const tx = await vinSocialContract.createPost(title, content, media);
    await tx.wait();
    alert("Post created!");
    loadPosts();
  } catch (err) {
    console.error("Post creation failed:", err);
    alert("Failed to create post.");
  }
}

// Load user posts
async function loadPosts() {
  const postFeed = document.getElementById("postFeed");
  postFeed.innerHTML = "Loading...";
  try {
    const postIds = await vinSocialContract.getUserPosts(userAddress);
    let html = "";
    for (let id of postIds.reverse()) {
      const post = await vinSocialContract.posts(id);
      html += `<div class="post">
        <h3>${post[1]}</h3>
        <p>${post[2]}</p>
        ${post[3] ? `<img src="${post[3]}" style="max-width:100%; margin-top:10px;" />` : ""}
        <small>By ${post[0]}</small>
      </div>`;
    }
    postFeed.innerHTML = html || "No posts yet.";
  } catch (err) {
    console.error("Load post error:", err);
    postFeed.innerText = "Failed to load posts.";
  }
}

document.getElementById("loginBtn").addEventListener("click", connectWallet);
document.getElementById("registerBtn").addEventListener("click", async () => {
  if (!signer || !userAddress) {
    await connectWallet();
  }
  document.getElementById("registrationForm").scrollIntoView({ behavior: "smooth" });
});
document.getElementById("regForm").addEventListener("submit", handleFormSubmission);
