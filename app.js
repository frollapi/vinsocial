// 👉 Địa chỉ hợp đồng
const vinSocialAddress = "0x2DB5a0Dcf2942d552EF02D683b4d5852A7431a87";
const vinTokenAddress = "0x941F63807401efCE8afe3C9d88d368bAA287Fac4";

// 👉 ABI của VinSocial (rút gọn phần dùng nhiều)
const socialAbi = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_vinToken",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "Registered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "postId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "author",
        "type": "address"
      }
    ],
    "name": "PostCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "postId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "Liked",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "postId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "message",
        "type": "string"
      }
    ],
    "name": "Commented",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "postId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "Shared",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      }
    ],
    "name": "Followed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      }
    ],
    "name": "Unfollowed",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "vinToken",
    "outputs": [
      {
        "internalType": "contract IVIN",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "nextPostId",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "REGISTRATION_FEE",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "bio",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "avatarUrl",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "website",
        "type": "string"
      }
    ],
    "name": "register",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "title",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "content",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "media",
        "type": "string"
      }
    ],
    "name": "createPost",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "postId",
        "type": "uint256"
      }
    ],
    "name": "likePost",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "postId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "message",
        "type": "string"
      }
    ],
    "name": "commentOnPost",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "postId",
        "type": "uint256"
      }
    ],
    "name": "sharePost",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "follow",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "unfollow",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      }
    ],
    "name": "isFollowing",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "postId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "hasLiked",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "getUserPosts",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "postId",
        "type": "uint256"
      }
    ],
    "name": "getComments",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "commenter",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "message",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          }
        ],
        "internalType": "struct VinSocial.Comment[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// 👉 ABI rút gọn của token VIN
const vinAbi = [
  {
    "inputs":[{"internalType":"address","name":"owner","type":"address"}],
    "name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],
    "stateMutability":"view","type":"function"
  },
  {
    "inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],
    "name":"estimateFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],
    "stateMutability":"view","type":"function"
  },
  {
    "inputs":[
      {"internalType":"address","name":"owner","type":"address"},
      {"internalType":"address","name":"spender","type":"address"}
    ],
    "name":"allowance",
    "outputs":[{"internalType":"uint256","name":"","type":"uint256"}],
    "stateMutability":"view","type":"function"
  },
  {
    "inputs":[
      {"internalType":"address","name":"from","type":"address"},
      {"internalType":"address","name":"to","type":"address"},
      {"internalType":"uint256","name":"amount","type":"uint256"}
    ],
    "name":"transferFrom",
    "outputs":[{"internalType":"bool","name":"","type":"bool"}],
    "stateMutability":"nonpayable",
    "type":"function"
  }
];

let provider, signer, vinToken, contract;
let currentAccount = null;
let isRegistered = false;

// 👉 Kết nối MetaMask
async function connectWallet() {
  if (typeof window.ethereum === "undefined") {
    alert("⚠️ Please install MetaMask to use VinSocial.");
    return;
  }

  try {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    currentAccount = await signer.getAddress();

    // Load contracts
    vinToken = new ethers.Contract(vinTokenAddress, vinAbi, signer);
    contract = new ethers.Contract(vinSocialAddress, socialAbi, signer);

    // Cập nhật giao diện ví
    document.getElementById("walletAddress").innerText = currentAccount;
    document.getElementById("walletInfo").classList.remove("hidden");
    document.getElementById("disconnectBtn").classList.remove("hidden");
    document.getElementById("connectBtn").classList.add("hidden");

    await updateBalances();
    await checkRegistration();
  } catch (err) {
    console.error("❌ Wallet connection error:", err);
    alert("Failed to connect wallet.");
  }
}
// 👉 Cập nhật số dư VIN và VIC
async function updateBalances() {
  try {
    const vinBal = await vinToken.balanceOf(currentAccount);
    const vinFormatted = ethers.utils.formatUnits(vinBal, 18);
    document.getElementById("vinBalance").innerText = `${parseFloat(vinFormatted).toFixed(2)} VIN`;

    const vicBal = await provider.getBalance(currentAccount);
    const vicFormatted = ethers.utils.formatEther(vicBal);
    document.getElementById("vicBalance").innerText = `${parseFloat(vicFormatted).toFixed(4)} VIC`;
  } catch (err) {
    console.error("❌ Failed to fetch balances:", err);
  }
}

// 👉 Kiểm tra ví đã đăng ký chưa
async function checkRegistration() {
  try {
    const registered = await contract.registered(currentAccount);
    isRegistered = registered

    if (registered) {
      // Đã đăng ký → hiển thị giao diện chính
      document.getElementById("registerSection").classList.add("hidden");
      document.getElementById("createPostSection").classList.remove("hidden");
    } else {
      // Chưa đăng ký → hiển thị form đăng ký
      document.getElementById("registerSection").classList.remove("hidden");
      document.getElementById("createPostSection").classList.add("hidden");
    }
  } catch (err) {
    console.error("❌ Failed to check registration:", err);
  }
}

// 👉 Xử lý sự kiện đăng ký tài khoản
document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("nickname").value.trim();
  const bio = document.getElementById("bio").value.trim();
  const avatar = document.getElementById("avatarUrl").value.trim();
  const website = document.getElementById("website").value.trim();

  if (!name) {
    alert("Please enter your nickname.");
    return;
  }

  try {
    const fee = await vinToken.estimateFee(REGISTRATION_FEE);
    const total = REGISTRATION_FEE.add(fee);

    const allowance = await vinToken.allowance(currentAccount, vinSocialAddress);
    if (allowance.lt(total)) {
      alert("Please approve token allowance before registration.");
      return;
    }

    const tx = await contract.register(name, bio, avatar, website);
    await tx.wait();

    alert("✅ Registration successful!");
    await checkRegistration();
  } catch (err) {
    console.error("❌ Registration failed:", err);
    alert("Registration failed. Please check console.");
  }
});

// 👉 Gửi bài viết mới
document.getElementById("postForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("postTitle").value.trim();
  const content = document.getElementById("postContent").value.trim();
  const media = document.getElementById("mediaUrl").value.trim();

  if (!title || !content) {
    alert("Please enter both title and content.");
    return;
  }

  try {
    const tx = await contract.createPost(title, content, media);
    await tx.wait();
    alert("✅ Post published successfully!");
    document.getElementById("postForm").reset();
    loadPosts();
  } catch (err) {
    console.error("❌ Post creation failed:", err);
    alert("Failed to publish post.");
  }
});

// 👉 Tải bài viết mới nhất (feed)
async function loadPosts() {
  const container = document.getElementById("feedContainer");
  container.innerHTML = "";

  try {
    const nextId = await contract.nextPostId();
    const latest = nextId.toNumber() - 1;

    for (let id = latest; id > 0 && id > latest - 50; id--) {
      const post = await contract.posts(id);
      const postHtml = `
        <div class="post">
          <h3>${post.title}</h3>
          <p id="post-content-${id}">${post.content}</p>
          ${post.media ? `<p><a href="${post.media}" target="_blank">Media Link</a></p>` : ""}
          <button class="translate-btn" onclick="translatePost(${id})">🌐 Translate</button>
          <div class="meta">Posted by ${shortAddress(post.author)} at ${formatDate(post.timestamp)}</div>
        </div>
      `;
      container.innerHTML += postHtml;
    }

    if (latest === 0) {
      container.innerHTML = "<p>No posts yet.</p>";
    }
  } catch (err) {
    console.error("❌ Error loading posts:", err);
    container.innerHTML = "<p>Error loading posts.</p>";
  }
}
// 👉 Rút gọn địa chỉ ví cho đẹp
function shortAddress(addr) {
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

// 👉 Chuyển timestamp sang ngày giờ dễ đọc
function formatDate(timestamp) {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString();
}

// 👉 Dịch bài viết bằng Google Translate
function translatePost(postId) {
  const content = document.getElementById(`post-content-${postId}`).innerText;
  const url = `https://translate.google.com/?sl=auto&tl=en&text=${encodeURIComponent(content)}`;
  window.open(url, "_blank");
}

// 👉 Khi tải trang nếu đã từng kết nối ví thì tự kết nối lại
window.addEventListener("load", async () => {
  if (window.ethereum && window.ethereum.selectedAddress) {
    await connectWallet();
  }
});
