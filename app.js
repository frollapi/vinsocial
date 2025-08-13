/* =========================
   VinSocial.vin — app.js (Cập nhật)
   ========================= */

/* ---------- Network & Addresses ---------- */
const vinSocialAddress = "0xAdd06EcD128004bFd35057d7a765562feeB77798"; // Địa chỉ hợp đồng mới
const vinTokenAddress = "0x941F63807401efCE8afe3C9d88d368bAA287Fac4";  // Địa chỉ token VIN (VIC mainnet)

let provider, signer, userAddress;
let vinSocialContract, vinTokenContract, vinSocialReadOnly;
let isRegistered = false;
let lastPostId = 0;
let seen = new Set();

/* ABI cho hợp đồng VIN và VinSocial */
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
  "function viewPost(uint256) external",
  "function follow(address) external",
  "function unfollow(address) external",
  "function getUserPosts(address) view returns (uint256[])",
  "function getComments(uint256) view returns (tuple(address commenter,string message,uint256 timestamp)[])",
  "function posts(uint256) view returns (address,string,string,string,uint256)",
  "function users(address) view returns (string,string,string,string)",
  "function nextPostId() view returns (uint256)",
  "function likeCount(uint256) view returns (uint256)",
  "function shareCount(uint256) view returns (uint256)",
  "function viewCount(uint256) view returns (uint256)",
  "function getFollowers(address) view returns (address[])",
  "function getFollowing(address) view returns (address[])"
];

// 👉 Load giao diện khi mở trang
window.onload = async () => {
  if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    vinSocialReadOnly = new ethers.Contract(vinSocialAddress, vinSocialAbi, provider);
    await tryAutoConnect();
  } else {
    provider = new ethers.providers.JsonRpcProvider("https://rpc.viction.xyz");
    vinSocialReadOnly = new ethers.Contract(vinSocialAddress, vinSocialAbi, provider);
    showHome(true); // vẫn cho xem bài khi chưa có ví
  }
};

// 👉 Kết nối ví
async function connectWallet() {
  await provider.send("eth_requestAccounts", []);
  signer = provider.getSigner();
  userAddress = await signer.getAddress();
  await setupContracts();
  vinSocialReadOnly = new ethers.Contract(vinSocialAddress, vinSocialAbi, provider);
  await updateUI();
}

// 👉 Ngắt kết nối ví
function disconnectWallet() {
  userAddress = null;
  isRegistered = false;
  document.getElementById("walletAddress").innerText = "Not connected";
  document.getElementById("connectBtn").style.display = "inline-block";
  document.getElementById("disconnectBtn").style.display = "none";
  document.getElementById("mainNav").style.display = "none";
  document.getElementById("mainContent").innerHTML = `<p class="tip">Tip: Use VIC chain in MetaMask. On mobile, open in the wallet's browser (e.g. Viction, MetaMask).</p>`;
}

// 👉 Gọi hợp đồng khi đã kết nối
async function setupContracts() {
  vinSocialContract = new ethers.Contract(vinSocialAddress, vinSocialAbi, signer);
  vinTokenContract = new ethers.Contract(vinTokenAddress, vinTokenAbi, signer);
}

// 👉 Tự kết nối lại nếu đã từng kết nối
async function tryAutoConnect() {
  const accounts = await provider.send("eth_accounts", []);
  if (accounts.length > 0) {
    userAddress = accounts[0];
    signer = provider.getSigner();
    await setupContracts();
    await updateUI();
  } else {
    showHome(true);
  }
}

// 👉 Hiển thị số dư ví và cập nhật menu
async function updateUI() {
  const vinBal = await vinTokenContract.balanceOf(userAddress);
  const vicBal = await provider.getBalance(userAddress);
  const vin = parseFloat(ethers.utils.formatEther(vinBal)).toFixed(2);
  const vic = parseFloat(ethers.utils.formatEther(vicBal)).toFixed(4);

  document.getElementById("walletAddress").innerHTML = `
    <span style="font-family: monospace;">${userAddress}</span>
    <button onclick="copyToClipboard('${userAddress}')" title="Copy address">📋</button>
    <span style="margin-left: 10px;">| ${vin} VIN | ${vic} VIC</span>
  `;

  document.getElementById("connectBtn").style.display = "none";
  document.getElementById("disconnectBtn").style.display = "inline-block";
  isRegistered = await vinSocialContract.isRegistered(userAddress);
  updateMenu();
  showHome(true);
}

// 👉 Nút copy ví
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert("Address copied to clipboard!");
  });
}

// 👉 Rút gọn ví (dùng cho hồ sơ, comment, v.v.)
function shorten(addr) {
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

// 👉 Hiển thị menu điều hướng
function updateMenu() {
  const nav = document.getElementById("mainNav");
  nav.style.display = "flex";
  if (isRegistered) {
    nav.innerHTML = `
      <button class="nav-btn" onclick="showHome(true)">🏠 Home</button>
      <button class="nav-btn" onclick="showProfile()">👤 My Profile</button>
      <button class="nav-btn" onclick="showNewPost()">✍️ New Post</button>
      <form onsubmit="searchByAddress(); return false;" style="margin-left: 10px;">
        <input type="text" id="searchInput" placeholder="Search wallet..." style="padding:4px; font-size:13px; border-radius:6px; border:1px solid #ccc;" />
        <button type="submit" style="padding:4px 8px; margin-left:5px; border-radius:6px; background:#007bff; color:white; border:none;">🔍</button>
      </form>
    `;
  } else {
    nav.innerHTML = `
      <button class="nav-btn" onclick="showHome(true)">🏠 Home</button>
      <button class="nav-btn" onclick="showRegister()">📝 Register</button>
    `;
  }
}

// 👉 Tìm kiếm theo địa chỉ ví
function searchByAddress() {
  const input = document.getElementById("searchInput").value.trim();
  if (!ethers.utils.isAddress(input)) {
    alert("Please enter a valid wallet address.");
    return;
  }
  viewProfile(input);
}

// 👉 Gán sự kiện kết nối / ngắt kết nối
document.getElementById("connectBtn").onclick = connectWallet;
document.getElementById("disconnectBtn").onclick = disconnectWallet;

// 👉 Hiển thị bài viết mới nhất (gồm ❤️, 🔁, 👁️ – không gọi viewPost để tiết kiệm gas)
async function showHome(reset = false) {
  if (reset) {
    lastPostId = 0;
    seen.clear();
    document.getElementById("mainContent").innerHTML = `<h2>Latest Posts</h2>`;
  }

  let html = "";
  if (lastPostId === 0) {
    try {
      const next = await vinSocialReadOnly.nextPostId();
      lastPostId = next.toNumber();
    } catch (e) {
      console.error("Cannot fetch nextPostId", e);
      return;
    }
  }

  let i = lastPostId - 1;
  let loaded = 0;

  while (i > 0 && loaded < 5) {
    if (seen.has(i)) {
      i--;
      continue;
    }

    try {
      const post = await vinSocialReadOnly.posts(i);
      if (post[0] === "0x0000000000000000000000000000000000000000" || post[4] === 0) {
        seen.add(i);
        i--;
        continue;
      }

      const key = `${post[1]}|${post[2]}|${post[4]}`;
      if (seen.has(key)) {
        i--;
        continue;
      }

      seen.add(i);
      seen.add(key);

      const fullAddress = post[0];
      const title = post[1];
      const content = post[2];
      const media = post[3];
      const time = new Date(post[4] * 1000).toLocaleString();

      const [likes, shares, views] = await Promise.all([ 
        vinSocialReadOnly.likeCount(i), 
        vinSocialReadOnly.shareCount(i), 
        vinSocialReadOnly.viewCount(i)
      ]);

      html += `
        <div class="post">
          <div class="title">${title}</div>
          <div class="author">
            <span style="font-family: monospace;">${fullAddress}</span>
            <button onclick="copyToClipboard('${fullAddress}')" title="Copy" style="margin-left: 4px;">📋</button>
            • ${time}
          </div>
          <div class="content">${content}</div>
          ${media ? `<img src="${media}" alt="media"/>` : ""}
          <div class="metrics">❤️ ${likes} • 🔁 ${shares} • 👁️ ${views}</div>
          <div class="actions">
            ${isRegistered ? `
              <button onclick="likePost(${i})">👍 Like</button>
              <button onclick="showComments(${i})">💬 Comment</button>
              <button onclick="sharePost(${i})">🔁 Share</button>
            ` : ""}
            <button onclick="viewProfile('${post[0]}')">👤 Profile</button>
            <button onclick="translatePost(decodeURIComponent('${encodeURIComponent(content)}'))">🌐 Translate</button>
          </div>
          <div id="comments-${i}"></div>
        </div>
      `;
      loaded++;
    } catch (err) {
      console.warn("Failed loading post", i, err);
    }
    i--;
  }

  lastPostId = i + 1;
  document.getElementById("mainContent").innerHTML += html;

  if (lastPostId > 1) {
    document.getElementById("mainContent").innerHTML += `
      <div style="text-align:center; margin-top:10px;">
        <button onclick="showHome()">⬇️ Load More</button>
      </div>
    `;
  }
}

