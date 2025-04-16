// 👉 Địa chỉ hợp đồng
const vinTokenAddress = "0x941F63807401efCE8afe3C9d88d368bAA287Fac4";
const vinSocialAddress = "0x2DB5a0Dcf2942d552EF02D683b4d5852A7431a87";

// 👉 ABI rút gọn
const vinAbi = [
  {
    "inputs": [{"internalType": "address", "name": "owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
];

const vinSocialAbi = [
  {
    "inputs": [{"internalType":"address","name":"user","type":"address"}],
    "name":"users",
    "outputs":[
      {"internalType":"bool","name":"isRegistered","type":"bool"},
      {"internalType":"string","name":"name","type":"string"},
      {"internalType":"string","name":"bio","type":"string"},
      {"internalType":"string","name":"avatar","type":"string"},
      {"internalType":"string","name":"website","type":"string"}
    ],
    "stateMutability":"view",
    "type":"function"
  }
];

// 👉 Biến toàn cục
let provider, signer, userAddress;
let vinTokenContract, vinSocialContract;

// 👉 Khi trang tải
window.addEventListener("load", () => {
  if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    document.getElementById("connectWalletBtn").addEventListener("click", connectWallet);
    document.getElementById("disconnectBtn").addEventListener("click", disconnectWallet);
  } else {
    alert("Please install MetaMask to use VinSocial.vin");
  }
});

// 👉 Kết nối ví
async function connectWallet() {
  try {
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    userAddress = await signer.getAddress();

    vinTokenContract = new ethers.Contract(vinTokenAddress, vinAbi, signer);
    vinSocialContract = new ethers.Contract(vinSocialAddress, vinSocialAbi, signer);

    document.getElementById("walletAddress").innerText = `Wallet: ${userAddress}`;
    document.getElementById("connectWalletBtn").style.display = "none";
    document.getElementById("wallet-section").classList.remove("hidden");
    document.getElementById("main-menu").classList.remove("hidden");
    document.getElementById("intro-section").classList.add("hidden");

    await showVinAndVic();
    await checkRegistration(); // phần sau sẽ viết
  } catch (err) {
    console.error("Wallet connection failed", err);
    alert("❌ Failed to connect wallet.");
  }
}

// 👉 Ngắt kết nối ví
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
    const vinRaw = await vinTokenContract.balanceOf(userAddress);
    const vin = parseFloat(ethers.utils.formatEther(vinRaw));
    document.getElementById("vinBalance").innerText = `VIN: ${vin.toFixed(3)}`;

    const vicRaw = await provider.getBalance(userAddress);
    const vic = parseFloat(ethers.utils.formatEther(vicRaw));
    document.getElementById("vicBalance").innerText = `VIC: ${vic.toFixed(3)}`;
  } catch (err) {
    console.error("Error getting balances", err);
  }
}

// 👉 Kiểm tra đăng ký
async function checkRegistration() {
  try {
    const raw = await vinSocialContract.users(userAddress);

    // Chuẩn hóa dữ liệu người dùng, dùng try-catch để tránh lỗi UTF-8
    let user = {
      isRegistered: raw.isRegistered,
      name: "", bio: "", avatar: "", website: ""
    };
    try { user.name = raw.name; } catch {}
    try { user.bio = raw.bio; } catch {}
    try { user.avatar = raw.avatar; } catch {}
    try { user.website = raw.website; } catch {}

    if (user.isRegistered) {
      document.getElementById("registerForm").classList.add("hidden");
      loadUserProfile(user);
      loadAllPosts(); // phần sau sẽ viết
    } else {
      document.getElementById("registerForm").classList.remove("hidden");
      showSection("profile-section");
    }

  } catch (err) {
    console.error("❌ Error checking registration:", err);
  }
}

// 👉 Hiển thị thông tin người dùng đã đăng ký
function loadUserProfile(user) {
  const profile = `
    <p><strong>Name:</strong> ${user.name}</p>
    <p><strong>Bio:</strong> ${user.bio}</p>
    ${user.avatar ? `<img src="${user.avatar}" alt="Avatar" style="max-width:80px;border-radius:8px;">` : ""}
    ${user.website ? `<p><a href="${user.website}" target="_blank">🌐 Website</a></p>` : ""}
  `;
  document.getElementById("profileArea").innerHTML = profile;
}

// 👉 Chuyển vùng hiển thị (menu)
function showSection(id) {
  const sections = document.querySelectorAll(".section");
  sections.forEach(sec => sec.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

// 👉 Đăng ký tài khoản (trả 0.05 VIN)
async function registerAccount() {
  const name = document.getElementById("nameInput").value.trim();
  const bio = document.getElementById("bioInput").value.trim();
  const avatar = document.getElementById("avatarInput").value.trim();
  const website = document.getElementById("websiteInput").value.trim();

  if (!name) {
    alert("Please enter your name.");
    return;
  }

  try {
    const tx = await vinSocialContract.register(name, bio, avatar, website, {
      value: ethers.utils.parseEther("0.05") // phí đăng ký
    });
    await tx.wait();
    alert("✅ Registration successful!");
    document.getElementById("registerForm").classList.add("hidden");
    await checkRegistration();
  } catch (err) {
    console.error("❌ Registration failed", err);
    alert("❌ Registration failed. Make sure you have 0.05 VIN and enough VIC to pay gas.");
  }
}

// 👉 Tạo bài viết mới
async function createPost() {
  const content = document.getElementById("postContent").value.trim();
  if (!content) {
    alert("Content cannot be empty");
    return;
  }

  try {
    const tx = await vinSocialContract.createPost(content, {
      value: ethers.utils.parseEther("0.001") // phí viết bài
    });
    await tx.wait();

    document.getElementById("postContent").value = "";
    alert("✅ Post created!");
    loadAllPosts();
  } catch (err) {
    console.error("❌ Post failed", err);
    alert("❌ Failed to post. Make sure you have VIN and some VIC for gas.");
  }
}

// 👉 Tải tất cả bài viết từ hợp đồng
async function loadAllPosts() {
  try {
    const posts = await vinSocialContract.getAllPosts();
    const postList = document.getElementById("postList");
    postList.innerHTML = "";

    posts.slice().reverse().forEach((post) => {
      const el = document.createElement("div");
      el.className = "post";
      el.innerHTML = `
        <div class="post-header">Author: ${post.author}</div>
        <div class="post-content">${post.content}</div>
        <div class="post-actions">
          <span onclick="alert('🔒 Please register to like')">👍 Like</span>
          <span onclick="alert('🔒 Please register to comment')">💬 Comment</span>
          <span onclick="alert('🔒 Please register to share')">🔁 Share</span>
          <a href="https://translate.google.com/?sl=auto&tl=en&text=${encodeURIComponent(post.content)}" target="_blank">🌐 Translate</a>
        </div>
      `;
      postList.appendChild(el);
    });
  } catch (err) {
    console.error("❌ Failed to load posts", err);
  }
}

// 👉 Tải bài viết cá nhân
async function loadMyPosts() {
  try {
    const posts = await vinSocialContract.getAllPosts();
    const myPostList = document.getElementById("myPostList");
    myPostList.innerHTML = "";

    posts
      .filter(post => post.author.toLowerCase() === userAddress.toLowerCase())
      .slice().reverse()
      .forEach((post) => {
        const el = document.createElement("div");
        el.className = "post";
        el.innerHTML = `
          <div class="post-header">You</div>
          <div class="post-content">${post.content}</div>
          <div class="post-actions">
            <a href="https://translate.google.com/?sl=auto&tl=en&text=${encodeURIComponent(post.content)}" target="_blank">🌐 Translate</a>
          </div>
        `;
        myPostList.appendChild(el);
      });
  } catch (err) {
    console.error("❌ Failed to load your posts", err);
  }
}

<span onclick="alert('🔒 Please register to like')">👍 Like</span>
<span onclick="alert('🔒 Please register to comment')">💬 Comment</span>
<span onclick="alert('🔒 Please register to share')">🔁 Share</span>
