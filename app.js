// 👉 Địa chỉ hợp đồng và ABI
const vinSocialAddress = "0xeff6a28C1858D6faa95c0813946E9F0020ebf41D";
const vinTokenAddress = "0x941F63807401efCE8afe3C9d88d368bAA287Fac4";

// 👉 ABI của token VIN (chuẩn VRC25)
const vinTokenAbi = [
  { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }], "name": "allowance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount" }], "name": "approve", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount" }], "name": "transferFrom", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "uint256", "name": "value" }], "name": "estimateFee", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }
];

// 👉 ABI của VinSocial (sẽ dán đầy đủ trong phần cuối khi ghép)
const vinSocialAbi = [
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
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "isRegistered",
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
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      }
    ],
    "name": "isUserFollowing",
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
    "name": "getFollowers",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
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
    "name": "getFollowing",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

let provider, signer, userAddress;
let vinSocialContract, vinTokenContract;

// 👉 Hàm khởi động kết nối ví
async function connectWallet() {
  if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    userAddress = await signer.getAddress();

    vinSocialContract = new ethers.Contract(vinSocialAddress, vinSocialAbi, signer);
    vinTokenContract = new ethers.Contract(vinTokenAddress, vinTokenAbi, signer);

    document.getElementById("walletAddress").innerText = userAddress;
    document.getElementById("connectBtn").style.display = "none";
    document.getElementById("walletDetails").style.display = "block";

    await updateBalances();
    checkRegistration();
  } else {
    alert("Please install MetaMask and switch to VIC network.");
  }
}

// 👉 Cập nhật số dư VIN và VIC
async function updateBalances() {
  try {
    const vinRaw = await vinTokenContract.balanceOf(userAddress);
    const vicRaw = await provider.getBalance(userAddress);
    const vin = Number(ethers.utils.formatUnits(vinRaw, 18)).toFixed(2);
    const vic = Number(ethers.utils.formatEther(vicRaw)).toFixed(4);

    document.getElementById("vinBalance").innerText = vin + " VIN";
    document.getElementById("vicBalance").innerText = vic + " VIC";
  } catch (err) {
    console.error("Balance error:", err);
  }
}

// 👉 Ngắt kết nối ví
function disconnectWallet() {
  provider = null;
  signer = null;
  userAddress = null;
  document.getElementById("walletDetails").style.display = "none";
  document.getElementById("connectBtn").style.display = "inline-block";
}

// 👉 Gắn nút sự kiện
document.getElementById("connectBtn").addEventListener("click", connectWallet);
document.getElementById("disconnectBtn").addEventListener("click", disconnectWallet);

// 👉 Kiểm tra ví đã đăng ký chưa
async function checkRegistration() {
  try {
    const registered = await vinSocialContract.isRegistered(userAddress);
    if (registered) {
      document.getElementById("registerBtn").style.display = "none";
      document.getElementById("postBtn").style.display = "inline-block";
      document.getElementById("registrationForm").classList.add("hidden");
    } else {
      document.getElementById("registerBtn").style.display = "inline-block";
      document.getElementById("postBtn").style.display = "none";
    }
  } catch (err) {
    console.error("Check registration failed:", err);
  }
}

// 👉 Hiện/ẩn form khi bấm nút Register
document.getElementById("registerBtn").addEventListener("click", () => {
  document.getElementById("registrationForm").classList.toggle("hidden");
});

// 👉 Xử lý form đăng ký
const REGISTRATION_FEE = ethers.utils.parseUnits("0.05", 18);

document.getElementById("regForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const bio = document.getElementById("bio").value;
  const avatarUrl = document.getElementById("avatarUrl").value;
  const website = document.getElementById("website").value;

  try {
    // Tính phí giao dịch
    const fee = await vinTokenContract.estimateFee(REGISTRATION_FEE);
    const total = REGISTRATION_FEE.add(fee);

    // Kiểm tra allowance
    const allowance = await vinTokenContract.allowance(userAddress, vinSocialAddress);
    if (allowance.lt(total)) {
      const approveTx = await vinTokenContract.approve(vinSocialAddress, total);
      await approveTx.wait();
    }

    // Gọi hàm register
    const registerTx = await vinSocialContract.register(name, bio, avatarUrl, website);
    await registerTx.wait();

    alert("✅ Registered successfully!");
    document.getElementById("registrationForm").classList.add("hidden");
    document.getElementById("registerBtn").style.display = "none";
    document.getElementById("postBtn").style.display = "inline-block";
  } catch (err) {
    console.error("Registration error:", err);
    alert("❌ Registration failed. Please try again.");
  }
});

// 👉 Gắn sự kiện nút Post để hiện form tạo bài
document.getElementById("postBtn").addEventListener("click", () => {
  document.getElementById("newPostForm").classList.toggle("hidden");
});

// 👉 Xử lý gửi bài viết mới
document.getElementById("postForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("postTitle").value;
  const content = document.getElementById("postContent").value;
  const media = document.getElementById("postMedia").value;

  try {
    const tx = await vinSocialContract.createPost(title, content, media);
    await tx.wait();

    alert("✅ Post created!");
    document.getElementById("postForm").reset();
    document.getElementById("newPostForm").classList.add("hidden");
    loadFeed(); // Tải lại danh sách bài viết sau khi đăng
  } catch (err) {
    console.error("Post error:", err);
    alert("❌ Failed to post.");
  }
});

// 👉 Hiển thị danh sách bài viết (Feed chính)
async function loadFeed() {
  const feedContainer = document.getElementById("feed");
  feedContainer.innerHTML = "<p>Loading posts...</p>";

  try {
    const posts = await vinSocialContract.getUserPosts(userAddress);
    if (posts.length === 0) {
      feedContainer.innerHTML = "<p>No posts yet.</p>";
      return;
    }

    feedContainer.innerHTML = "";

    for (let i = posts.length - 1; i >= 0; i--) {
      const postId = posts[i];
      const post = await vinSocialContract.posts(postId);
      const comments = await vinSocialContract.getComments(postId);

      const postEl = document.createElement("div");
      postEl.className = "post";
      postEl.innerHTML = `
        <h3>${post.title}</h3>
        <p>${post.content}</p>
        ${post.media ? `<img src="${post.media}" alt="media" style="max-width:100%;border-radius:8px;" />` : ""}
        <p><small>By: ${post.author}</small></p>
        <button onclick="likePost(${postId})">👍 Like</button>
        <button onclick="toggleComment(${postId})">💬 Comment</button>
        <button onclick="sharePost(${postId})">🔁 Share</button>
        <div id="commentBox-${postId}" class="hidden">
          <form onsubmit="submitComment(event, ${postId})">
            <input type="text" placeholder="Your comment" id="commentInput-${postId}" required />
            <button type="submit">Send</button>
          </form>
          <div>${comments.map(c => `<p><strong>${c.commenter}</strong>: ${c.message}</p>`).join("")}</div>
        </div>
      `;
      feedContainer.appendChild(postEl);
    }
  } catch (err) {
    console.error("Load feed error:", err);
    feedContainer.innerHTML = "<p>Error loading posts.</p>";
  }
}

// 👉 Like bài viết
async function likePost(postId) {
  try {
    const tx = await vinSocialContract.likePost(postId);
    await tx.wait();
    alert("👍 Liked!");
    loadFeed();
  } catch (err) {
    console.error("Like error:", err);
    alert("❌ Failed to like post.");
  }
}

// 👉 Hiện/ẩn khung comment
function toggleComment(postId) {
  const box = document.getElementById(`commentBox-${postId}`);
  if (box) box.classList.toggle("hidden");
}

// 👉 Gửi bình luận
async function submitComment(event, postId) {
  event.preventDefault();
  const input = document.getElementById(`commentInput-${postId}`);
  const message = input.value.trim();

  if (!message) return;

  try {
    const tx = await vinSocialContract.commentOnPost(postId, message);
    await tx.wait();
    input.value = "";
    alert("💬 Comment sent!");
    loadFeed(); // reload bài viết để hiện comment mới
  } catch (err) {
    console.error("Comment error:", err);
    alert("❌ Failed to comment.");
  }
}

// 👉 Share bài viết
async function sharePost(postId) {
  try {
    const tx = await vinSocialContract.sharePost(postId);
    await tx.wait();
    alert("🔁 Shared!");
  } catch (err) {
    console.error("Share error:", err);
    alert("❌ Failed to share.");
  }
}

// 👉 Xem hồ sơ cá nhân
document.getElementById("myProfileBtn").addEventListener("click", async () => {
  document.getElementById("feed").style.display = "none";
  document.getElementById("profileView").classList.remove("hidden");

  try {
    const posts = await vinSocialContract.getUserPosts(userAddress);
    const profileInfo = document.getElementById("profileInfo");
    const profilePosts = document.getElementById("profilePosts");

    profileInfo.innerHTML = `<h2>My Profile</h2><p>Wallet: ${userAddress}</p>`;
    profilePosts.innerHTML = posts.length === 0 ? "<p>No posts yet.</p>" : "";

    for (let i = posts.length - 1; i >= 0; i--) {
      const post = await vinSocialContract.posts(posts[i]);
      const postEl = document.createElement("div");
      postEl.className = "post";
      postEl.innerHTML = `
        <h3>${post.title}</h3>
        <p>${post.content}</p>
        ${post.media ? `<img src="${post.media}" style="max-width:100%;" />` : ""}
        <p><small>Post ID: ${posts[i]}</small></p>
      `;
      profilePosts.appendChild(postEl);
    }
  } catch (err) {
    console.error("Profile error:", err);
    alert("Failed to load profile.");
  }
});

// 👉 Xem hồ sơ người khác (gọi khi click tên tác giả)
async function viewUserProfile(address) {
  document.getElementById("feed").style.display = "none";
  document.getElementById("userProfileView").classList.remove("hidden");

  const infoBox = document.getElementById("userProfileInfo");
  const postBox = document.getElementById("userProfilePosts");

  try {
    const posts = await vinSocialContract.getUserPosts(address);
    const isFollowing = await vinSocialContract.isUserFollowing(userAddress, address);

    infoBox.innerHTML = `
      <h2>User: ${address}</h2>
      <button onclick="toggleFollow('${address}')">${isFollowing ? "Unfollow" : "Follow"}</button>
    `;

    postBox.innerHTML = posts.length === 0 ? "<p>No posts yet.</p>" : "";

    for (let i = posts.length - 1; i >= 0; i--) {
      const post = await vinSocialContract.posts(posts[i]);
      const postEl = document.createElement("div");
      postEl.className = "post";
      postEl.innerHTML = `
        <h3>${post.title}</h3>
        <p>${post.content}</p>
        ${post.media ? `<img src="${post.media}" style="max-width:100%;" />` : ""}
        <p><small>Post ID: ${posts[i]}</small></p>
      `;
      postBox.appendChild(postEl);
    }
  } catch (err) {
    console.error("View user error:", err);
  }
}

// 👉 Follow / Unfollow người khác
async function toggleFollow(address) {
  try {
    const isFollowing = await vinSocialContract.isUserFollowing(userAddress, address);
    if (isFollowing) {
      const tx = await vinSocialContract.unfollow(address);
      await tx.wait();
      alert("❎ Unfollowed");
    } else {
      const tx = await vinSocialContract.follow(address);
      await tx.wait();
      alert("✅ Followed");
    }
    viewUserProfile(address); // refresh lại
  } catch (err) {
    console.error("Follow error:", err);
    alert("❌ Failed to follow/unfollow.");
  }
}
