// 👉 Địa chỉ hợp đồng
const vinTokenAddress = "0x941F63807401efCE8afe3C9d88d368bAA287Fac4"; // Token VIN
const vinSocialAddress = "0x2DB5a0Dcf2942d552EF02D683b4d5852A7431a87"; // Hợp đồng VinSocial

// 👉 ABI rút gọn
const vinAbi = [
  {
    "inputs": [{"internalType": "address","name": "owner","type": "address"}],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256","name": "","type": "uint256"}],
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
  },
  {
    "inputs":[
      {"internalType":"string","name":"name","type":"string"},
      {"internalType":"string","name":"bio","type":"string"},
      {"internalType":"string","name":"avatar","type":"string"},
      {"internalType":"string","name":"website","type":"string"}
    ],
    "name":"register",
    "outputs":[],
    "stateMutability":"payable",
    "type":"function"
  },
  {
    "inputs": [{"internalType":"string","name":"content","type":"string"}],
    "name": "createPost",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllPosts",
    "outputs": [{
      "components": [
        {"internalType":"address","name":"author","type":"address"},
        {"internalType":"string","name":"content","type":"string"},
        {"internalType":"uint256","name":"timestamp","type":"uint256"}
      ],
      "internalType":"struct VinSocial.Post[]",
      "name":"",
      "type":"tuple[]"
    }],
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
    document.getElementById("registerBtn").addEventListener("click", registerAccount);
    document.getElementById("submitPostBtn").addEventListener("click", createPost);
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
    await checkRegistration();
  } catch (err) {
    console.error("Wallet connection failed", err);
    alert("❌ Failed to connect wallet.");
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

// 👉 Hiển thị số dư
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
    const user = await vinSocialContract.users(userAddress);
    if (user.isRegistered) {
      document.getElementById("registerForm").classList.add("hidden");
      loadUserProfile(user);
      loadAllPosts();
    } else {
      document.getElementById("registerForm").classList.remove("hidden");
      showSection("profile-section");
    }
  } catch (err) {
    console.error("Error checking registration:", err);
  }
}

// 👉 Đăng ký
async function registerAccount() {
  const name = document.getElementById("nameInput").value.trim();
  const bio = document.getElementById("bioInput").value.trim();
  const avatar = document.getElementById("avatarInput").value.trim();
  const website = document.getElementById("websiteInput").value.trim();

  if (!name) return alert("Please enter a name");

  try {
    const tx = await vinSocialContract.register(name, bio, avatar, website, {
      value: ethers.utils.parseEther("0.05")
    });
    await tx.wait();
    alert("✅ Registration successful!");
    document.getElementById("registerForm").classList.add("hidden");
    await checkRegistration();
  } catch (err) {
    console.error("Registration failed", err);
    alert("❌ Registration failed. Do you have at least 0.05 VIN and some VIC for gas?");
  }
}

// 👉 Hiển thị thông tin hồ sơ
function loadUserProfile(user) {
  const profile = `
    <p><strong>Name:</strong> ${user.name}</p>
    <p><strong>Bio:</strong> ${user.bio}</p>
    ${user.avatar ? `<img src="${user.avatar}" alt="Avatar" style="max-width:80px;border-radius:8px;">` : ""}
    ${user.website ? `<p><a href="${user.website}" target="_blank">🌐 Website</a></p>` : ""}
  `;
  document.getElementById("profileArea").innerHTML = profile;
}

// 👉 Chuyển section
function showSection(id) {
  const sections = document.querySelectorAll(".section");
  sections.forEach(sec => sec.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

// 👉 Tạo bài viết
async function createPost() {
  const content = document.getElementById("postContent").value.trim();
  if (!content) return alert("Content cannot be empty");
  try {
    const tx = await vinSocialContract.createPost(content, {
      value: ethers.utils.parseEther("0.001") // phí viết bài
    });
    await tx.wait();
    document.getElementById("postContent").value = "";
    alert("✅ Post created!");
    loadAllPosts();
  } catch (err) {
    console.error("Post failed", err);
    alert("❌ Post failed. Maybe not enough VIN or VIC?");
  }
}

// 👉 Tải tất cả bài viết
async function loadAllPosts() {
  try {
    const posts = await vinSocialContract.getAllPosts();
    const postList = document.getElementById("postList");
    postList.innerHTML = "";

    posts.slice().reverse().forEach((post, index) => {
      const el = document.createElement("div");
      el.className = "post";
      el.innerHTML = `
        <div class="post-header">Author: ${post.author}</div>
        <div class="post-content">${post.content}</div>
        <div class="post-actions">
          <span onclick="alert('Please register to interact.')">👍 Like</span>
          <span onclick="alert('Please register to interact.')">💬 Comment</span>
          <span onclick="alert('Please register to interact.')">🔁 Share</span>
          <a href="https://translate.google.com/?sl=auto&tl=en&text=${encodeURIComponent(post.content)}" target="_blank">🌐 Translate</a>
        </div>
      `;
      postList.appendChild(el);
    });
  } catch (err) {
    console.error("Failed to load posts", err);
  }
}
