// 👉 Địa chỉ hợp đồng
const vinTokenAddress = "0x941F63807401efCE8afe3C9d88d368bAA287Fac4";
const vinSocialAddress = "0x2DB5a0Dcf2942d552EF02D683b4d5852A7431a87";

// 👉 ABI rút gọn
const vinAbi = [
  {
    "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
];

const vinSocialAbi = [
  {
    "inputs": [{ "internalType": "address", "name": "user", "type": "address" }],
    "name": "users",
    "outputs": [
      { "internalType": "bool", "name": "isRegistered", "type": "bool" },
      { "internalType": "string", "name": "name", "type": "string" },
      { "internalType": "string", "name": "bio", "type": "string" },
      { "internalType": "string", "name": "avatar", "type": "string" },
      { "internalType": "string", "name": "website", "type": "string" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "name", "type": "string" },
      { "internalType": "string", "name": "bio", "type": "string" },
      { "internalType": "string", "name": "avatar", "type": "string" },
      { "internalType": "string", "name": "website", "type": "string" }
    ],
    "name": "register",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "title", "type": "string" },
      { "internalType": "string", "name": "content", "type": "string" },
      { "internalType": "string", "name": "media", "type": "string" }
    ],
    "name": "createPost",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllPosts",
    "outputs": [
      {
        "components": [
          { "internalType": "address", "name": "author", "type": "address" },
          { "internalType": "string", "name": "title", "type": "string" },
          { "internalType": "string", "name": "content", "type": "string" },
          { "internalType": "string", "name": "media", "type": "string" },
          { "internalType": "uint256", "name": "timestamp", "type": "uint256" }
        ],
        "internalType": "struct VinSocial.Post[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// 👉 Biến toàn cục
let provider, signer, userAddress;
let vinToken, vinSocial;

// 👉 Khi trang tải
window.addEventListener("load", () => {
  if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    document.getElementById("connectWalletBtn").addEventListener("click", connectWallet);
    document.getElementById("disconnectBtn").addEventListener("click", disconnectWallet);
    document.getElementById("registerBtn").addEventListener("click", registerAccount);
    document.getElementById("submitPostBtn").addEventListener("click", createPost);
  } else {
    alert("🦊 Please install MetaMask to use VinSocial.vin");
  }
});

// 👉 Kết nối ví
async function connectWallet() {
  try {
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    userAddress = await signer.getAddress();
    vinToken = new ethers.Contract(vinTokenAddress, vinAbi, signer);
    vinSocial = new ethers.Contract(vinSocialAddress, vinSocialAbi, signer);
    document.getElementById("walletAddress").innerText = `Wallet: ${userAddress}`;
    document.getElementById("connectWalletBtn").style.display = "none";
    document.getElementById("wallet-section").classList.remove("hidden");
    document.getElementById("main-menu").classList.remove("hidden");
    document.getElementById("intro-section").classList.add("hidden");
    await showVinAndVic();
    await checkRegistration();
  } catch (err) {
    console.error("❌ Wallet connection failed:", err);
    alert("Failed to connect wallet");
  }
}

// 👉 Ngắt kết nối
function disconnectWallet() {
  signer = null;
  userAddress = null;
  document.getElementById("walletAddress").innerText = "";
  document.getElementById("wallet-section").classList.add("hidden");
  document.getElementById("main-menu").classList.add("hidden");
  document.getElementById("connectWalletBtn").style.display = "inline-block";
  document.getElementById("intro-section").classList.remove("hidden");
}

// 👉 Hiển thị số dư VIN & VIC
async function showVinAndVic() {
  try {
    const vinRaw = await vinToken.balanceOf(userAddress);
    const vin = parseFloat(ethers.utils.formatEther(vinRaw));
    document.getElementById("vinBalance").innerText = `VIN: ${vin.toFixed(3)}`;

    const vicRaw = await provider.getBalance(userAddress);
    const vic = parseFloat(ethers.utils.formatEther(vicRaw));
    document.getElementById("vicBalance").innerText = `VIC: ${vic.toFixed(3)}`;
  } catch (err) {
    console.error("❌ Error getting balances:", err);
  }
}

// 👉 Kiểm tra đăng ký tài khoản
async function checkRegistration() {
  try {
    const raw = await vinSocial.users(userAddress);
    let user = {
      isRegistered: raw.isRegistered,
      name: "", bio: "", avatar: "", website: ""
    };
    try { user.name = raw.name } catch {}
    try { user.bio = raw.bio } catch {}
    try { user.avatar = raw.avatar } catch {}
    try { user.website = raw.website } catch {}

    if (user.isRegistered) {
      document.getElementById("registerForm").classList.add("hidden");
      loadUserProfile(user);
      loadAllPosts();
    } else {
      document.getElementById("registerForm").classList.remove("hidden");
      showSection("profile-section");
    }
  } catch (err) {
    console.error("❌ Error checking registration:", err);
  }
}

// 👉 Hiển thị hồ sơ người dùng
function loadUserProfile(user) {
  const profile = `
    <p><strong>Name:</strong> ${user.name}</p>
    <p><strong>Bio:</strong> ${user.bio}</p>
    ${user.avatar ? `<img src="${user.avatar}" style="max-width:100px">` : ""}
    ${user.website ? `<p><a href="${user.website}" target="_blank">🌐 Website</a></p>` : ""}
  `;
  document.getElementById("profileArea").innerHTML = profile;
}

// 👉 Chuyển vùng hiển thị
function showSection(id) {
  document.querySelectorAll(".section").forEach(sec => sec.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

// 👉 Đăng ký tài khoản
async function registerAccount() {
  const name = document.getElementById("nameInput").value.trim();
  const bio = document.getElementById("bioInput").value.trim();
  const avatar = document.getElementById("avatarInput").value.trim();
  const website = document.getElementById("websiteInput").value.trim();
  if (!name) return alert("Please enter your name.");

  try {
    const tx = await vinSocial.register(name, bio, avatar, website, {
      value: ethers.utils.parseEther("0.05")
    });
    await tx.wait();
    alert("✅ Registration successful!");
    await checkRegistration();
  } catch (err) {
    console.error("❌ Registration failed:", err);
    alert("Registration failed. Make sure you have 0.05 VIN and enough VIC for gas.");
  }
}

// 👉 Tạo bài viết mới
async function createPost() {
  const title = document.getElementById("postTitle").value.trim();
  const content = document.getElementById("postContent").value.trim();
  const media = document.getElementById("postMedia").value.trim();

  if (!content) return alert("Post content cannot be empty.");

  try {
    const tx = await vinSocial.createPost(title, content, media, {
      value: ethers.utils.parseEther("0.001")
    });
    await tx.wait();

    document.getElementById("postTitle").value = "";
    document.getElementById("postContent").value = "";
    document.getElementById("postMedia").value = "";

    alert("✅ Post created!");
    loadAllPosts();
  } catch (err) {
    console.error("❌ Post creation failed:", err);
    alert("Failed to post. Ensure you have VIN and VIC for gas.");
  }
}

// 👉 Tải bài viết cộng đồng
async function loadAllPosts() {
  try {
    const posts = await vinSocial.getAllPosts();
    const postList = document.getElementById("postList");
    postList.innerHTML = "";

    posts.slice().reverse().forEach(p => {
      const el = document.createElement("div");
      el.className = "post";
      el.innerHTML = `
        <div class="post-header">${p.title || "Untitled"} by ${shortenAddress(p.author)}</div>
        <div class="post-content">${p.content}</div>
        ${p.media ? `<img src="${p.media}" />` : ""}
        <div class="post-actions">
          <a href="https://translate.google.com/?sl=auto&tl=en&text=${encodeURIComponent(p.content)}" target="_blank">🌐 Translate</a>
        </div>
      `;
      postList.appendChild(el);
    });
  } catch (err) {
    console.error("❌ Failed to load posts:", err);
  }
}

// 👉 Rút gọn địa chỉ ví
function shortenAddress(addr) {
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

// 👉 Tải bài viết cá nhân
async function loadMyPosts() {
  try {
    const posts = await vinSocial.getAllPosts();
    const myPostList = document.getElementById("myPostList");
    myPostList.innerHTML = "";

    posts
      .filter(p => p.author.toLowerCase() === userAddress.toLowerCase())
      .slice().reverse()
      .forEach(p => {
        const el = document.createElement("div");
        el.className = "post";
        el.innerHTML = `
          <div class="post-header">${p.title || "Untitled"} (You)</div>
          <div class="post-content">${p.content}</div>
          ${p.media ? `<img src="${p.media}" />` : ""}
          <div class="post-actions">
            <a href="https://translate.google.com/?sl=auto&tl=en&text=${encodeURIComponent(p.content)}" target="_blank">🌐 Translate</a>
          </div>
        `;
        myPostList.appendChild(el);
      });
  } catch (err) {
    console.error("❌ Failed to load personal posts:", err);
  }
}

// 👉 Placeholder cho các tương tác chưa mở rộng trên hợp đồng
function likePost(postId) {
  alert("🔒 Please register to like (feature to be added in contract)");
}

function commentPost(postId) {
  alert("🔒 Please register to comment (feature to be added in contract)");
}

function sharePost(postId) {
  alert("🔒 Please register to share (feature to be added in contract)");
}

// 👉 Tự động dịch bài viết bằng Google Translate
function translatePost(content) {
  const url = `https://translate.google.com/?sl=auto&tl=en&text=${encodeURIComponent(content)}`;
  window.open(url, "_blank");
}
