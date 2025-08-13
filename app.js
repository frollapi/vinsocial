/* =========================
   VinSocial.vin — app.js
   - Ethers v5 (theo index.html)
   - Hợp đồng VinSocial mới
   - Tối đa 20,000 ký tự + giữ xuống dòng
   - Textarea auto-resize
   - Phí đăng ký: 0.001 VIN (approve + register)
   ========================= */

/* ---------- Network & Addresses ---------- */
const VIC_CHAIN = {
  chainId: "0x58", // 88 dec
  chainName: "Viction Mainnet",
  nativeCurrency: { name: "VIC", symbol: "VIC", decimals: 18 },
  rpcUrls: ["https://rpc.viction.xyz"],
  blockExplorerUrls: ["https://vicscan.xyz"],
};

// ✅ Địa chỉ triển khai mới bạn vừa deploy
const VIN_SOCIAL_ADDR = "0xAdd06EcD128004bFd35057d7a765562feeB77798";
// ✅ Địa chỉ token VIN (VIC mainnet) bạn cung cấp
const VIN_TOKEN_ADDR  = "0x941F63807401efCE8afe3C9d88d368bAA287Fac4";

/* ---------- ABIs ---------- */
// ERC20 tối giản cho approve/balance
const ERC20_ABI = [
  "function approve(address spender, uint256 value) public returns (bool)",
  "function allowance(address owner, address spender) public view returns (uint256)",
  "function balanceOf(address account) public view returns (uint256)",
  "function decimals() public view returns (uint8)"
];

// ABI VinSocial mới (bản bạn vừa xuất)
const VIN_SOCIAL_ABI = [
  {"inputs":[{"internalType":"address","name":"_vinToken","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"postId","type":"uint256"},{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"string","name":"message","type":"string"}],"name":"Commented","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"}],"name":"Followed","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"postId","type":"uint256"},{"indexed":true,"internalType":"address","name":"user","type":"address"}],"name":"Liked","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"postId","type":"uint256"},{"indexed":true,"internalType":"address","name":"author","type":"address"}],"name":"PostCreated","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"}],"name":"Registered","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"postId","type":"uint256"},{"indexed":true,"internalType":"address","name":"user","type":"address"}],"name":"Shared","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"}],"name":"Unfollowed","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"postId","type":"uint256"},{"indexed":true,"internalType":"address","name":"viewer","type":"address"}],"name":"Viewed","type":"event"},
  {"inputs":[],"name":"REGISTRATION_FEE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"postId","type":"uint256"},{"internalType":"string","name":"message","type":"string"}],"name":"commentOnPost","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"comments","outputs":[{"internalType":"address","name":"commenter","type":"address"},{"internalType":"string","name":"message","type":"string"},{"internalType":"uint256","name":"timestamp","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"string","name":"title","type":"string"},{"internalType":"string","name":"content","type":"string"},{"internalType":"string","name":"media","type":"string"}],"name":"createPost","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"follow","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"followers","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"following","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"postId","type":"uint256"}],"name":"getComments","outputs":[{"components":[{"internalType":"address","name":"commenter","type":"address"},{"internalType":"string","name":"message","type":"string"},{"internalType":"uint256","name":"timestamp","type":"uint256"}],"internalType":"struct VinSocial.Comment[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getFollowers","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getFollowing","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getUserPosts","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"postId","type":"uint256"},{"internalType":"address","name":"user","type":"address"}],"name":"hasLiked","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"isFollowing","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"isRegistered","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"}],"name":"isUserFollowing","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"likeCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"postId","type":"uint256"}],"name":"likePost","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"address","name":"","type":"address"}],"name":"liked","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"nextPostId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"posts","outputs":[{"internalType":"address","name":"author","type":"address"},{"internalType":"string","name":"title","type":"string"},{"internalType":"string","name":"content","type":"string"},{"internalType":"string","name":"media","type":"string"},{"internalType":"uint256","name":"timestamp","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"bio","type":"string"},{"internalType":"string","name":"avatarUrl","type":"string"},{"internalType":"string","name":"website","type":"string"}],"name":"register","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"shareCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"postId","type":"uint256"}],"name":"sharePost","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"unfollow","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"userPosts","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"users","outputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"bio","type":"string"},{"internalType":"string","name":"avatarUrl","type":"string"},{"internalType":"string","name":"website","type":"string"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"viewCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"postId","type":"uint256"}],"name":"viewPost","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[],"name":"vinToken","outputs":[{"internalType":"contract IVIN","name":"","type":"address"}],"stateMutability":"view","type":"function"}
];

/* ---------- State ---------- */
let provider, signer, userAddress;
let vinToken, vinSocial;

/* ---------- Helpers ---------- */
const $ = (id) => document.getElementById(id);
function shortAddr(a) { return a ? a.slice(0,6)+"..."+a.slice(-4) : ""; }

/* Auto-resize textarea up to a max height (optional clamp) */
function autoResize(el) {
  el.style.height = "auto";
  el.style.height = Math.min(el.scrollHeight, 1200) + "px"; // 1200px trần an toàn
}

/* ---------- Wallet ---------- */
async function ensureVIC() {
  const eth = window.ethereum;
  if (!eth) throw new Error("No wallet found");
  const chainId = await eth.request({ method: "eth_chainId" });
  if (chainId !== VIC_CHAIN.chainId) {
    try {
      await eth.request({ method: "wallet_switchEthereumChain", params: [{ chainId: VIC_CHAIN.chainId }] });
    } catch (e) {
      if (e && e.code === 4902) {
        await eth.request({ method: "wallet_addEthereumChain", params: [VIC_CHAIN] });
      } else {
        throw e;
      }
    }
  }
}

async function connectWallet() {
  try {
    await ensureVIC();
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    userAddress = await signer.getAddress();
    $("walletAddress").innerText = shortAddr(userAddress);
    $("connectBtn").style.display = "none";
    $("disconnectBtn").style.display = "inline-block";
    initContracts();
    await renderApp();
  } catch (err) {
    alert("Connect failed. Please approve wallet requests and ensure VIC network is selected.");
    console.error(err);
  }
}

function disconnectWallet() {
  provider = undefined;
  signer = undefined;
  userAddress = undefined;
  $("walletAddress").innerText = "Not connected";
  $("connectBtn").style.display = "inline-block";
  $("disconnectBtn").style.display = "none";
  renderApp(); // render chế độ xem công khai
}

function initContracts() {
  vinToken  = new ethers.Contract(VIN_TOKEN_ADDR, ERC20_ABI, signer || provider);
  vinSocial = new ethers.Contract(VIN_SOCIAL_ADDR, VIN_SOCIAL_ABI, signer || provider);
}

