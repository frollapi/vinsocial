// 👉 Địa chỉ hợp đồng
const vinSocialAddress = "0x2DB5a0Dcf2942d552EF02D683b4d5852A7431a87";
const vinTokenAddress = "0x941F63807401efCE8afe3C9d88d368bAA287Fac4";

// 👉 ABI rút gọn của VIN token (cần thiết cho balanceOf và transfer)
const vinAbi = [
  { "inputs": [{"internalType":"address","name":"owner","type":"address"}],
    "name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],
    "stateMutability":"view","type":"function"
  },
  {
    "inputs": [
      {"internalType":"address","name":"recipient","type":"address"},
      {"internalType":"uint256","name":"amount","type":"uint256"}
    ],
    "name":"transfer",
    "outputs":[{"internalType":"bool","name":"","type":"bool"}],
    "stateMutability":"nonpayable","type":"function"
  }
];

// 👉 Kết nối MetaMask
let provider, signer, userAddress;

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

      document.getElementById("walletAddress").innerText = "Wallet: " + userAddress;
      document.getElementById("wallet-section").classList.add("hidden");

      await checkRegistration();
    } catch (error) {
      console.error("Wallet connection error:", error);
    }
  } else {
    alert("Please install MetaMask.");
  }
}

document.getElementById("connectWalletBtn").addEventListener("click", connectWallet);

// 👉 ABI rút gọn hợp đồng VinSocial – bạn cần chèn đầy đủ ABI thật ở cuối sau này
const vinSocialAbi = [
  {
    "inputs": [{"internalType":"address","name":"user","type":"address"}],
    "name":"isRegistered",
    "outputs":[{"internalType":"bool","name":"","type":"bool"}],
    "stateMutability":"view","type":"function"
  },
  {
    "inputs": [{"internalType":"string","name":"nickname","type":"string"}],
    "name":"register",
    "outputs":[],
    "stateMutability":"nonpayable",
    "type":"function"
  }
];

// 👉 Khởi tạo contract
const vinSocialContract = new ethers.Contract(vinSocialAddress, vinSocialAbi, signer);
const vinTokenContract = new ethers.Contract(vinTokenAddress, vinAbi, signer);

// 👉 Kiểm tra xem ví đã đăng ký chưa
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

// 👉 Xử lý đăng ký và trả 0.05 VIN
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

    // Gửi 0.05 VIN đến contract VinSocial thông qua chính chức năng register (VIN sẽ được kiểm tra hoặc burn trong contract)
    const tx = await vinTokenContract.transfer(vinSocialAddress, vinAmount);
    await tx.wait();

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

// 👉 Lấy số dư VIN và VIC + giá VIN
async function loadBalances() {
  try {
    const vinBal = await vinTokenContract.balanceOf(userAddress);
    const vinDisplay = ethers.utils.formatUnits(vinBal, 18);
    document.getElementById("vinBalance").innerText = `VIN: ${parseFloat(vinDisplay).toFixed(4)}`;

    const vicBal = await provider.getBalance(userAddress);
    const vicDisplay = ethers.utils.formatEther(vicBal);
    document.getElementById("vicBalance").innerText = `VIC: ${parseFloat(vicDisplay).toFixed(4)}`;

    // 👉 Lấy giá VIN = giá VIC × 100 (giá VIC lấy từ Binance API)
    const res = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=VICUSDT");
    const data = await res.json();
    const priceVin = parseFloat(data.price) * 100;
    document.getElementById("vinPrice").innerText = `1 VIN ≈ $${priceVin.toFixed(2)} USD`;
  } catch (err) {
    console.error("Balance load error:", err);
  }
}

// 👉 Ngắt kết nối ví (reset giao diện)
document.getElementById("disconnectBtn").addEventListener("click", () => {
  location.reload(); // đơn giản: tải lại trang là đủ
});

// 👉 Thêm ABI tạm cho post & feed (bạn sẽ cần chèn đầy đủ ở phần ABI đầy đủ)
vinSocialAbi.push(
  {
    "inputs": [{"internalType":"string","name":"content","type":"string"}],
    "name":"createPost",
    "outputs":[],
    "stateMutability":"nonpayable",
    "type":"function"
  },
  {
    "inputs":[],
    "name":"getAllPosts",
    "outputs":[
      {
        "components":[
          {"internalType":"address","name":"author","type":"address"},
          {"internalType":"string","name":"nickname","type":"string"},
          {"internalType":"string","name":"content","type":"string"},
          {"internalType":"uint256","name":"timestamp","type":"uint256"}
        ],
        "internalType":"struct Post[]",
        "name":"",
        "type":"tuple[]"
      }
    ],
    "stateMutability":"view",
    "type":"function"
  },
  {
    "inputs": [{"internalType":"address","name":"user","type":"address"}],
    "name":"getPostsBy",
    "outputs":[
      {
        "components":[
          {"internalType":"address","name":"author","type":"address"},
          {"internalType":"string","name":"nickname","type":"string"},
          {"internalType":"string","name":"content","type":"string"},
          {"internalType":"uint256","name":"timestamp","type":"uint256"}
        ],
        "internalType":"struct Post[]",
        "name":"",
        "type":"tuple[]"
      }
    ],
    "stateMutability":"view",
    "type":"function"
  }
);

// 👉 Tạo bài viết
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

// 👉 Load bài viết (feed toàn bộ)
async function loadFeed() {
  try {
    const posts = await vinSocialContract.getAllPosts();
    renderPosts(posts, "postList");
  } catch (err) {
    console.error("Load feed failed:", err);
  }
}

// 👉 Load bài viết của chính mình
async function loadMyPosts() {
  try {
    const posts = await vinSocialContract.getPostsBy(userAddress);
    renderPosts(posts, "myPostList");
  } catch (err) {
    console.error("Load my posts failed:", err);
  }
}

// 👉 Hiển thị bài viết
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

// 👉 Escape HTML
function escapeHTML(str) {
  return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// 👉 Chuyển vùng hiển thị menu
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
