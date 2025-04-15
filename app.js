// 👉 Địa chỉ hợp đồng
const vinSocialAddress = "0x2DB5a0Dcf2942d552EF02D683b4d5852A7431a87";
const vinTokenAddress = "0x941F63807401efCE8afe3C9d88d368bAA287Fac4";

// 👉 ABI rút gọn của VIN token (chỉ cần balanceOf và transfer)
const vinAbi = [
  {
    "inputs": [{"internalType":"address","name":"owner","type":"address"}],
    "name":"balanceOf",
    "outputs":[{"internalType":"uint256","name":"","type":"uint256"}],
    "stateMutability":"view",
    "type":"function"
  },
  {
    "inputs": [
      {"internalType":"address","name":"recipient","type":"address"},
      {"internalType":"uint256","name":"amount","type":"uint256"}
    ],
    "name":"transfer",
    "outputs":[{"internalType":"bool","name":"","type":"bool"}],
    "stateMutability":"nonpayable",
    "type":"function"
  }
];

// 👉 ABI rút gọn hợp đồng VinSocial – sẽ mở rộng ở phần sau
const vinSocialAbi = [
  {
    "inputs": [{"internalType":"address","name":"user","type":"address"}],
    "name":"isRegistered",
    "outputs":[{"internalType":"bool","name":"","type":"bool"}],
    "stateMutability":"view",
    "type":"function"
  },
  {
    "inputs": [{"internalType":"string","name":"nickname","type":"string"}],
    "name":"register",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// 👉 Biến toàn cục
let provider, signer, userAddress;
let vinTokenContract, vinSocialContract;

// 👉 Kết nối ví MetaMask
async function connectWallet() {
  if (window.ethereum) {
    try {
      provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      signer = provider.getSigner();
      userAddress = await signer.getAddress();

      const network = await provider.getNetwork();
      if (network.chainId !== 88) {
        alert("Please switch to the VIC network.");
        return;
      }

      // 👉 Khởi tạo 2 contract sau khi có signer
      vinTokenContract = new ethers.Contract(vinTokenAddress, vinAbi, signer);
      vinSocialContract = new ethers.Contract(vinSocialAddress, vinSocialAbi, signer);

      // 👉 Hiển thị ví
      document.getElementById("walletAddress").innerText = "Wallet: " + userAddress;
      document.getElementById("wallet-section").classList.add("hidden");

      // 👉 Kiểm tra trạng thái đăng ký
      await checkRegistration();
    } catch (error) {
      console.error("Wallet connection error:", error);
    }
  } else {
    alert("Please install MetaMask.");
  }
}

document.getElementById("connectWalletBtn").addEventListener("click", connectWallet);

// 👉 Kiểm tra ví đã đăng ký chưa
async function checkRegistration() {
  try {
    const registered = await vinSocialContract.isRegistered(userAddress);
    if (registered) {
      document.getElementById("main-app").classList.remove("hidden");
      await loadBalances();
      await loadFeed();
    } else {
      document.getElementById("registration-section").classList.remove("hidden");
    }
  } catch (err) {
    console.error("Error checking registration:", err);
  }
}

// 👉 Đăng ký tài khoản và trả 0.05 VIN
document.getElementById("registerBtn").addEventListener("click", async () => {
  const nickname = document.getElementById("nicknameInput").value.trim();
  if (!nickname) {
    alert("Please enter a nickname.");
    return;
  }

  try {
    const vinAmount = ethers.utils.parseUnits("0.05", 18);
    const balance = await vinTokenContract.balanceOf(userAddress);

    if (balance.lt(vinAmount)) {
      alert("Insufficient VIN to register.");
      return;
    }

    // 👉 Chuyển 0.05 VIN đến contract trước
    const tx = await vinTokenContract.transfer(vinSocialAddress, vinAmount);
    await tx.wait();

    // 👉 Gọi hàm register(nickname)
    const registerTx = await vinSocialContract.register(nickname);
    await registerTx.wait();

    alert("Registration successful!");
    document.getElementById("registration-section").classList.add("hidden");
    document.getElementById("main-app").classList.remove("hidden");
    await loadBalances();
    await loadFeed();
  } catch (err) {
    console.error("Registration error:", err);
    alert("Registration failed.");
  }
});

// 👉 Hiển thị số dư VIN, VIC và giá VIN ≈ USD
async function loadBalances() {
  try {
    const vinBal = await vinTokenContract.balanceOf(userAddress);
    const vinDisplay = ethers.utils.formatUnits(vinBal, 18);
    document.getElementById("vinBalance").innerText = `VIN: ${parseFloat(vinDisplay).toFixed(4)}`;

    const vicBal = await provider.getBalance(userAddress);
    const vicDisplay = ethers.utils.formatEther(vicBal);
    document.getElementById("vicBalance").innerText = `VIC: ${parseFloat(vicDisplay).toFixed(4)}`;

    const res = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=VICUSDT");
    const data = await res.json();
    const priceVin = parseFloat(data.price) * 100;
    document.getElementById("vinPrice").innerText = `1 VIN ≈ $${priceVin.toFixed(2)} USD`;
  } catch (err) {
    console.error("Balance load error:", err);
  }
}

// 👉 Ngắt kết nối ví = tải lại giao diện
document.getElementById("disconnectBtn").addEventListener("click", () => {
  location.reload();
});

// 👉 Mở rộng ABI: createPost, getAllPosts, getPostsBy
vinSocialAbi.push(
  {
    "inputs": [{"internalType":"string","name":"content","type":"string"}],
    "name":"createPost",
    "outputs": [],
    "stateMutability":"nonpayable",
    "type":"function"
  },
  {
    "inputs": [],
    "name":"getAllPosts",
    "outputs": [{
      "components": [
        {"internalType":"address","name":"author","type":"address"},
        {"internalType":"string","name":"nickname","type":"string"},
        {"internalType":"string","name":"content","type":"string"},
        {"internalType":"uint256","name":"timestamp","type":"uint256"}
      ],
      "internalType":"struct Post[]",
      "name":"",
      "type":"tuple[]"
    }],
    "stateMutability":"view",
    "type":"function"
  },
  {
    "inputs": [{"internalType":"address","name":"user","type":"address"}],
    "name":"getPostsBy",
    "outputs": [{
      "components": [
        {"internalType":"address","name":"author","type":"address"},
        {"internalType":"string","name":"nickname","type":"string"},
        {"internalType":"string","name":"content","type":"string"},
        {"internalType":"uint256","name":"timestamp","type":"uint256"}
      ],
      "internalType":"struct Post[]",
      "name":"",
      "type":"tuple[]"
    }],
    "stateMutability":"view",
    "type":"function"
  }
);

// 👉 Tạo bài viết mới
document.getElementById("submitPostBtn").addEventListener("click", async () => {
  const content = document.getElementById("postContent").value.trim();
  if (!content) {
    alert("Post content cannot be empty.");
    return;
  }

  try {
    const tx = await vinSocialContract.createPost(content);
    await tx.wait();
    alert("Post created!");
    document.getElementById("postContent").value = "";
    await loadFeed();
  } catch (err) {
    console.error("Post failed:", err);
    alert("Error posting.");
  }
});

// 👉 Load feed chung
async function loadFeed() {
  try {
    const posts = await vinSocialContract.getAllPosts();
    renderPosts(posts, "postList");
  } catch (err) {
    console.error("Load feed failed:", err);
  }
}

// 👉 Load bài viết của chính ví
async function loadMyPosts() {
  try {
    const posts = await vinSocialContract.getPostsBy(userAddress);
    renderPosts(posts, "myPostList");
  } catch (err) {
    console.error("Load my posts failed:", err);
  }
}

// 👉 Hiển thị danh sách bài viết
function renderPosts(posts, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  posts.slice().reverse().forEach(post => {
    const div = document.createElement("div");
    div.className = "post";
    div.innerHTML = `
      <div class="post-header">${post.nickname} (${shortAddr(post.author)})</div>
      <div class="post-content">${escapeHTML(post.content)}</div>
      <div class="post-actions">
        <span>👍 Like</span>
        <span>🔁 Share</span>
        <span>👁️ View</span>
      </div>
    `;
    container.appendChild(div);
  });
}

// 👉 Rút gọn địa chỉ ví
function shortAddr(addr) {
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

// 👉 Escape HTML đơn giản
function escapeHTML(str) {
  return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// 👉 Menu điều hướng giữa các vùng
function showSection(id) {
  const sections = ["feed-section", "create-post-section", "myposts-section", "howto-section"];
  sections.forEach(sec => {
    document.getElementById(sec).classList.add("hidden");
  });

  const target = {
    home: "feed-section",
    create: "create-post-section",
    myposts: "myposts-section",
    howto: "howto-section"
  }[id];

  if (target) {
    document.getElementById(target).classList.remove("hidden");
    if (id === "myposts") loadMyPosts();
  }
}
