// 👉 VinSocial App.js - Full Logic

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
  checkRegistration();
}

// Check registration
async function checkRegistration() {
  try {
    const isRegistered = await vinSocialContract.registered(userAddress);
    if (isRegistered) {
      document.getElementById("mainApp").style.display = "block";
      loadPosts();
    } else {
      document.getElementById("mainApp").style.display = "none";
      document.getElementById("status").innerText += "\nYou are not registered. Please register first.";
    }
  } catch (err) {
    console.error("Error checking registration:", err);
    document.getElementById("status").innerText = "Error connecting to contract.";
  }
}

// Register account
async function registerAccount() {
  if (!signer || !userAddress) {
    await connectWallet();
  }
  const name = prompt("Enter your display name:");
  const bio = prompt("Enter a short bio (optional):") || "";
  const avatarUrl = prompt("Enter avatar image URL (optional):") || "";
  const website = prompt("Enter your website (optional):") || "";

  try {
    const registrationFee = await vinSocialContract.REGISTRATION_FEE();
    const estimatedFee = await vinTokenContract.estimateFee(registrationFee);
    const totalFee = registrationFee.add(estimatedFee);
    const allowance = await vinTokenContract.allowance(userAddress, vinSocialAddress);
    if (allowance.lt(totalFee)) {
      alert("Please approve enough VIN to register (0.05 VIN + fee).");
      return;
    }
    const tx = await vinSocialContract.register(name, bio, avatarUrl, website);
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

// Load all posts from user
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
    console.error("Failed to load posts:", err);
    postFeed.innerText = "Failed to load posts.";
  }
}

document.getElementById("loginBtn").addEventListener("click", connectWallet);
document.getElementById("registerBtn").addEventListener("click", async () => {
  if (!signer || !userAddress) {
    await connectWallet();
  }
  registerAccount();
});
