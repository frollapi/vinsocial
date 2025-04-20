const vinSocialAddress = "0xeff6a28C1858D6faa95c0813946E9F0020ebf41D";
const vinTokenAddress = "0x941F63807401efCE8afe3C9d88d368bAA287Fac4";

let provider, signer, userAddress;
let vinSocialContract, vinTokenContract;
let vinSocialReadOnly;
let isRegistered = false;

const vinTokenAbi = [
  "function balanceOf(address account) view returns (uint256)",
  "function approve(address spender, uint256 amount) external returns (bool)"
];

const vinSocialAbi = [
  "function isRegistered(address) view returns (bool)",
  "function register(string,string,string,string) external",
  "function createPost(string,string,string) external",
  "function likePost(uint256) external",
  "function commentOnPost(uint256,string) external",
  "function sharePost(uint256) external",
  "function follow(address) external",
  "function unfollow(address) external",
  "function getUserPosts(address) view returns (uint256[])",
  "function getComments(uint256) view returns (tuple(address commenter,string message,uint256 timestamp)[])",
  "function posts(uint256) view returns (address,string,string,string,uint256)",
  "function users(address) view returns (string,string,string,string)"
];

window.onload = async () => {
  if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    vinSocialReadOnly = new ethers.Contract(vinSocialAddress, vinSocialAbi, provider);
    await tryAutoConnect();
  } else {
    provider = new ethers.providers.JsonRpcProvider();
    vinSocialReadOnly = new ethers.Contract(vinSocialAddress, vinSocialAbi, provider);
    showHome();
  }
};

async function connectWallet() {
  await provider.send("eth_requestAccounts", []);
  signer = provider.getSigner();
  userAddress = await signer.getAddress();
  await setupContracts();
  await updateUI();
}

function disconnectWallet() {
  userAddress = null;
  isRegistered = false;
  document.getElementById("walletAddress").innerText = "Not connected";
  document.getElementById("connectBtn").style.display = "inline-block";
  document.getElementById("disconnectBtn").style.display = "none";
  document.getElementById("mainNav").style.display = "none";
  document.getElementById("mainContent").innerHTML = `<p class="tip">Tip: Use VIC chain in MetaMask. On mobile, open in the wallet's browser (e.g. Viction, MetaMask).</p>`;
}

async function setupContracts() {
  vinSocialContract = new ethers.Contract(vinSocialAddress, vinSocialAbi, signer);
  vinTokenContract = new ethers.Contract(vinTokenAddress, vinTokenAbi, signer);
}

async function tryAutoConnect() {
  const accounts = await provider.send("eth_accounts", []);
  if (accounts.length > 0) {
    userAddress = accounts[0];
    signer = provider.getSigner();
    await setupContracts();
    await updateUI();
  }
}

async function updateUI() {
  const vinBal = await vinTokenContract.balanceOf(userAddress);
  const vicBal = await provider.getBalance(userAddress);
  const vin = parseFloat(ethers.utils.formatEther(vinBal)).toFixed(2);
  const vic = parseFloat(ethers.utils.formatEther(vicBal)).toFixed(4);
  document.getElementById("walletAddress").innerText = `${shorten(userAddress)} | ${vin} VIN | ${vic} VIC`;
  document.getElementById("connectBtn").style.display = "none";
  document.getElementById("disconnectBtn").style.display = "inline-block";

  isRegistered = await vinSocialContract.isRegistered(userAddress);
  updateMenu();
  showHome();
}

function shorten(addr) {
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

function updateMenu() {
  const nav = document.getElementById("mainNav");
  nav.style.display = "flex";
  if (isRegistered) {
    nav.innerHTML = `
      <button class="nav-btn" onclick="showHome()">🏠 Home</button>
      <button class="nav-btn" onclick="showProfile()">👤 My Profile</button>
      <button class="nav-btn" onclick="showNewPost()">✍️ New Post</button>
    `;
  } else {
    nav.innerHTML = `
      <button class="nav-btn" onclick="showHome()">🏠 Home</button>
      <button class="nav-btn" onclick="showRegister()">📝 Register</button>
    `;
  }
}

document.getElementById("connectBtn").onclick = connectWallet;
document.getElementById("disconnectBtn").onclick = disconnectWallet;

// Hiển thị bài viết
async function showHome() {
  document.getElementById("mainContent").innerHTML = `<h2>Latest Posts</h2>`;
  let html = "";
  for (let i = 1; i <= 1000; i++) {
    try {
      const post = await vinSocialReadOnly.posts(i);
      if (post[0] === "0x0000000000000000000000000000000000000000" || post[4] === 0) continue;
      const author = shorten(post[0]);
      const title = post[1];
      const content = post[2];
      const media = post[3];
      const time = new Date(post[4] * 1000).toLocaleString();

      html += `
        <div class="post">
          <div class="title">${title}</div>
          <div class="author">${author} • ${time}</div>
          <div class="content">${content}</div>
          ${media ? `<img src="${media}" alt="media"/>` : ""}
          <div class="actions">
            ${isRegistered ? `
              <button onclick="likePost(${i})">👍 Like</button>
              <button onclick="showComments(${i})">💬 Comment</button>
              <button onclick="sharePost(${i})">🔁 Share</button>` : ""}
            <button onclick="viewProfile('${post[0]}')">👤 Profile</button>
            <button onclick="translatePost('${content}')">🌐 Translate</button>
          </div>
          <div id="comments-${i}"></div>
        </div>
      `;
    } catch {
      break;
    }
  }
  document.getElementById("mainContent").innerHTML += html;
}

