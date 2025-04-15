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
  }
];

let provider, signer, vinToken, contract;
let currentAccount = null;

// 👉 Kết nối MetaMask
async function connectWallet() {
  if (typeof window.ethereum === "undefined") {
    alert("⚠️ Please install MetaMask first.");
    return;
  }

  try {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    currentAccount = await signer.getAddress();

    // Hiển thị địa chỉ
    document.getElementById("walletAddress").innerText = currentAccount;
    document.getElementById("walletInfo").classList.remove("hidden");
    document.getElementById("disconnectBtn").classList.remove("hidden");
    document.getElementById("connectBtn").classList.add("hidden");

    // Load contracts
    vinToken = new ethers.Contract(vinTokenAddress, vinAbi, provider);
    contract = new ethers.Contract(vinSocialAddress, socialAbi, signer);

    await updateBalances();
    loadPosts();
  } catch (err) {
    console.error("❌ Wallet connect error:", err);
    alert("Failed to connect wallet.");
  }
}

// 👉 Ngắt kết nối
function disconnectWallet() {
  currentAccount = null;
  document.getElementById("walletAddress").innerText = "Not connected";
  document.getElementById("walletInfo").classList.add("hidden");
  document.getElementById("disconnectBtn").classList.add("hidden");
  document.getElementById("connectBtn").classList.remove("hidden");
}

// 👉 Gán sự kiện nút
document.getElementById("connectBtn").addEventListener("click", connectWallet);
document.getElementById("disconnectBtn").addEventListener("click", disconnectWallet);

// 👉 Hiển thị số dư VIN và VIC
async function updateBalances() {
  try {
    // Số dư VIN từ hợp đồng
    const vinBal = await vinToken.balanceOf(currentAccount);
    const vinReadable = ethers.utils.formatUnits(vinBal, 18);
    document.getElementById("vinBalance").innerText = `${parseFloat(vinReadable).toFixed(2)} VIN`;

    // Số dư VIC từ provider
    const vicBal = await provider.getBalance(currentAccount);
    const vicReadable = ethers.utils.formatEther(vicBal);
    document.getElementById("vicBalance").innerText = `${parseFloat(vicReadable).toFixed(4)} VIC`;
  } catch (err) {
    console.error("❌ Error fetching balances:", err);
  }
}

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
    loadPosts(); // Refresh feed
  } catch (err) {
    console.error("❌ Post creation failed:", err);
    alert("Failed to publish post.");
  }
});

// 👉 Load bài viết
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

// 👉 Format địa chỉ ví rút gọn
function shortAddress(addr) {
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

// 👉 Định dạng ngày giờ từ timestamp
function formatDate(timestamp) {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString();
}

// 👉 Hàm dịch nội dung bài viết qua Google Translate
function translatePost(postId) {
  const content = document.getElementById(`post-content-${postId}`).innerText;
  const url = `https://translate.google.com/?sl=auto&tl=en&text=${encodeURIComponent(content)}`;
  window.open(url, "_blank");
}

// 👉 Khi trang tải xong: nếu đã từng kết nối ví thì tự kết nối lại
window.addEventListener("load", async () => {
  if (window.ethereum && window.ethereum.selectedAddress) {
    await connectWallet();
  }
});
