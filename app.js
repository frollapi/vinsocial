const vinSocialAddress = "0xdEDe433305ed14E3791CF5C47F66060F84a68F10";
const vinTokenAddress = "0x941F63807401efCE8afe3C9d88d368bAA287Fac4";

const vinAbi = [
  "function balanceOf(address) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function estimateFee(uint256 amount) view returns (uint256)"
];

const vinSocialAbi = [
  { "inputs": [{ "internalType": "address", "name": "_vinToken", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" },
  { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "user", "type": "address" }], "name": "Registered", "type": "event" },
  { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "postId", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "author", "type": "address" }], "name": "PostCreated", "type": "event" },
  { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "postId", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "user", "type": "address" }], "name": "Liked", "type": "event" },
  { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "postId", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "user", "type": "address" }, { "indexed": false, "internalType": "string", "name": "message", "type": "string" }], "name": "Commented", "type": "event" },
  { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "postId", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "user", "type": "address" }], "name": "Shared", "type": "event" },
  { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }], "name": "Followed", "type": "event" },
  { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }], "name": "Unfollowed", "type": "event" },
  { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "vinToken", "outputs": [{ "internalType": "contract IVIN", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "nextPostId", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "REGISTRATION_FEE", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "string", "name": "name", "type": "string" }, { "internalType": "string", "name": "bio", "type": "string" }, { "internalType": "string", "name": "avatarUrl", "type": "string" }, { "internalType": "string", "name": "website", "type": "string" }], "name": "register", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "string", "name": "title", "type": "string" }, { "internalType": "string", "name": "content", "type": "string" }, { "internalType": "string", "name": "media", "type": "string" }], "name": "createPost", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "uint256", "name": "postId", "type": "uint256" }], "name": "likePost", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "uint256", "name": "postId", "type": "uint256" }, { "internalType": "string", "name": "message", "type": "string" }], "name": "commentOnPost", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "uint256", "name": "postId", "type": "uint256" }], "name": "sharePost", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "user", "type": "address" }], "name": "follow", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "user", "type": "address" }], "name": "unfollow", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "user", "type": "address" }], "name": "getFollowers", "outputs": [{ "internalType": "address[]", "name": "", "type": "address[]" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "user", "type": "address" }], "name": "getFollowing", "outputs": [{ "internalType": "address[]", "name": "", "type": "address[]" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "user", "type": "address" }], "name": "getUserPosts", "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "uint256", "name": "postId", "type": "uint256" }], "name": "getComments", "outputs": [{ "components": [{ "internalType": "address", "name": "commenter", "type": "address" }, { "internalType": "string", "name": "message", "type": "string" }, { "internalType": "uint256", "name": "timestamp", "type": "uint256" }], "internalType": "struct VinSocial.Comment[]", "name": "", "type": "tuple[]" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "uint256", "name": "postId", "type": "uint256" }, { "internalType": "address", "name": "user", "type": "address" }], "name": "hasLiked", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }], "name": "isUserFollowing", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }
];

let provider, signer, userAddress;
let vinToken, vinSocial;
let registered = false;

window.addEventListener("load", async () => {
  document.getElementById("connectBtn").onclick = connectWallet;
  document.getElementById("disconnectBtn").onclick = () => location.reload();
  document.getElementById("homeBtn").onclick = loadFeed;
  document.getElementById("registerBtn").onclick = showRegistrationForm;
  document.getElementById("postBtn").onclick = showPostForm;

  await checkIfConnected();
});

async function checkIfConnected() {
  if (window.ethereum && window.ethereum.selectedAddress) {
    await connectWallet();
  }
}

async function connectWallet() {
  if (!window.ethereum) {
    alert("Please install MetaMask!");
    return;
  }

  provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  signer = provider.getSigner();
  userAddress = await signer.getAddress();

  vinToken = new ethers.Contract(vinTokenAddress, vinAbi, signer);
  vinSocial = new ethers.Contract(vinSocialAddress, vinSocialAbi, signer);

  document.getElementById("walletAddress").innerText = `Wallet: ${userAddress}`;
  document.getElementById("walletDetails").style.display = "block";
  document.getElementById("connectBtn").style.display = "none";

  await updateBalances();
  await checkRegistration();
  await loadFeed();
}

async function updateBalances() {
  const vinBal = await vinToken.balanceOf(userAddress);
  const vicBal = await provider.getBalance(userAddress);

  document.getElementById("vinBalance").innerText = `${ethers.utils.formatUnits(vinBal, 18)} VIN`;
  document.getElementById("vicBalance").innerText = `${ethers.utils.formatUnits(vicBal, 18)} VIC`;
}

