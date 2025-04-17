const vinSocialAddress = "0x2DB5a0Dcf2942d552EF02D683b4d5852A7431a87";
const vinTokenAddress = "0x941F63807401efCE8afe3C9d88d368bAA287Fac4";

let provider, signer, userAddress;
let vinSocialContract, vinTokenContract;
let currentView = "home";
let viewingAddress = null;

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
const vinTokenAbi = [
  "function balanceOf(address) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function estimateFee(uint256 amount) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)"
];

// Format đơn vị
function formatVin(v) {
  return Number(ethers.utils.formatUnits(v, 18)).toFixed(3);
}
function formatVic(v) {
  return Number(ethers.utils.formatUnits(v, 18)).toFixed(5);
}

// Kết nối ví
async function connectWallet() {
  if (!window.ethereum) {
    alert("Please install MetaMask.");
    return;
  }

  provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  signer = provider.getSigner();
  userAddress = await signer.getAddress();

  vinSocialContract = new ethers.Contract(vinSocialAddress, vinSocialAbi, signer);
  vinTokenContract = new ethers.Contract(vinTokenAddress, vinTokenAbi, signer);

  document.getElementById("status").innerText = "Connected: " + userAddress;

  const vin = await vinTokenContract.balanceOf(userAddress);
  const vic = await provider.getBalance(userAddress);
  document.getElementById("balances").innerText =
    `Balance: ${formatVin(vin)} VIN | ${formatVic(vic)} VIC`;

  // ✅ Đây là phần quan trọng: nếu đã đăng ký thì hiển thị giao diện chính
  const isRegistered = await vinSocialContract.registered(userAddress);
  if (isRegistered) {
    showMainApp();
  } else {
    showRegistrationForm();
  }
}


// Nút Register
document.getElementById("registerBtn").addEventListener("click", async () => {
  if (!signer) await connectWallet();
  const isRegistered = await vinSocialContract.registered(userAddress);
  if (isRegistered) {
    showMainApp();
  } else {
    showRegistrationForm();
  }
});

// Nút Login
document.getElementById("loginBtn").addEventListener("click", async () => {
  await connectWallet();
});

// Nút Home / My Profile
document.getElementById("homeBtn").addEventListener("click", () => {
  currentView = "home";
  showMainApp();
});

document.getElementById("myProfileBtn").addEventListener("click", () => {
  viewProfile(userAddress);
});

// Đăng ký
document.getElementById("regForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("regName").value.trim();
  const bio = document.getElementById("regBio").value.trim();
  const avatar = document.getElementById("regAvatar").value.trim();
  const website = document.getElementById("regWebsite").value.trim();

  if (name.length < 3 || name.length > 30) {
    alert("Display name must be 3–30 characters.");
    return;
  }

  const fee = await vinSocialContract.REGISTRATION_FEE();
  const est = await vinTokenContract.estimateFee(fee);
  const total = fee.add(est);

  const allowance = await vinTokenContract.allowance(userAddress, vinSocialAddress);
  if (allowance.lt(total)) {
    const approveTx = await vinTokenContract.approve(vinSocialAddress, total);
    await approveTx.wait();
  }

  const tx = await vinSocialContract.register(name, bio, avatar, website);
  await tx.wait();
  alert("Registration successful!");
  location.reload();
});

// Chuyển giao diện
function showMainApp() {
  currentView = "home";
  viewingAddress = null;
  document.getElementById("registrationForm").style.display = "none";
  document.getElementById("mainApp").style.display = "block";
  document.getElementById("profileView").style.display = "none";
  document.getElementById("homeBtn").style.display = "inline-block";
  document.getElementById("myProfileBtn").style.display = "inline-block";
  loadPosts();
}

function showRegistrationForm() {
  document.getElementById("registrationForm").style.display = "block";
  document.getElementById("mainApp").style.display = "none";
  document.getElementById("profileView").style.display = "none";
}

// Đăng bài mới
async function createPost() {
  const title = document.getElementById("postTitle").value.trim();
  const content = document.getElementById("postContent").value.trim();
  const media = document.getElementById("postMedia").value.trim();

  if (!title || !content) {
    alert("Please enter both title and content.");
    return;
  }

  const tx = await vinSocialContract.createPost(title, content, media);
  await tx.wait();
  alert("Post submitted!");
  loadPosts();
}

// Tải tất cả bài viết công khai
async function loadPosts() {
  const feed = document.getElementById("postFeed");
  feed.innerHTML = "";

  const count = await vinSocialContract.nextPostId();
  for (let i = count - 1; i >= 1; i--) {
    const post = await vinSocialContract.posts(i);
    const liked = await vinSocialContract.hasLiked(i, userAddress);
    const comments = await vinSocialContract.getComments(i);

    const postDiv = document.createElement("div");
    postDiv.className = "post";
    postDiv.innerHTML = `
      <h3>${post.title}</h3>
      <p>${post.content}</p>
      ${post.media ? `<img src="${post.media}" alt="media" style="max-width:100%;margin-top:10px;border-radius:6px;">` : ""}
      <small>By <a href="#" onclick="viewProfile('${post.author}')">${post.author}</a></small>
      <div class="actions">
        <button onclick="likePost(${i})" ${liked ? "disabled" : ""}>👍 Like</button>
        <button onclick="sharePost(${i})">🔁 Share</button>
        <button onclick="showCommentBox(${i})">💬 Comment</button>
      </div>
      <div id="comments-${i}" class="comment-section">
        ${comments.map(c => `<div class="comment"><b>${c.commenter}</b>: ${c.message}</div>`).join("")}
        <div id="comment-box-${i}" style="display:none;margin-top:8px;">
          <input type="text" id="comment-input-${i}" placeholder="Write a comment..." />
          <button onclick="submitComment(${i})">Send</button>
        </div>
      </div>
    `;
    feed.appendChild(postDiv);
  }
}

// Like bài viết
async function likePost(postId) {
  try {
    const tx = await vinSocialContract.likePost(postId);
    await tx.wait();
    alert("Liked!");
    loadPosts();
  } catch (err) {
    alert("Error: " + err.message);
  }
}

// Share bài viết
async function sharePost(postId) {
  try {
    const tx = await vinSocialContract.sharePost(postId);
    await tx.wait();
    alert("Shared!");
    loadPosts();
  } catch (err) {
    alert("Error: " + err.message);
  }
}

// Hiện ô nhập bình luận
function showCommentBox(postId) {
  document.getElementById(`comment-box-${postId}`).style.display = "block";
}

// Gửi bình luận
async function submitComment(postId) {
  const input = document.getElementById(`comment-input-${postId}`);
  const message = input.value.trim();
  if (!message) return;
  try {
    const tx = await vinSocialContract.commentOnPost(postId, message);
    await tx.wait();
    alert("Commented!");
    loadPosts();
  } catch (err) {
    alert("Error: " + err.message);
  }
}

// Xem profile người dùng
async function viewProfile(address) {
  if (!vinSocialContract) return;
  viewingAddress = address;
  currentView = "profile";

  document.getElementById("registrationForm").style.display = "none";
  document.getElementById("mainApp").style.display = "none";
  document.getElementById("profileView").style.display = "block";

  const user = await vinSocialContract.users(address);
  document.getElementById("profileName").innerText = user.name || address;
  document.getElementById("profileBio").innerText = user.bio || "";
  document.getElementById("profileAvatar").src = user.avatarUrl || "https://via.placeholder.com/80";
  document.getElementById("profileWebsite").innerText = user.website || "";
  document.getElementById("profileWebsite").href = user.website || "#";
  document.getElementById("profileJoined").innerText = new Date(user.createdAt * 1000).toLocaleDateString();

  const profilePosts = document.getElementById("profilePosts");
  profilePosts.innerHTML = "";

  const postIds = await vinSocialContract.getUserPosts(address);
  for (let i = postIds.length - 1; i >= 0; i--) {
    const post = await vinSocialContract.posts(postIds[i]);
    const postDiv = document.createElement("div");
    postDiv.className = "post";
    postDiv.innerHTML = `
      <h3>${post.title}</h3>
      <p>${post.content}</p>
      ${post.media ? `<img src="${post.media}" alt="media" style="max-width:100%;margin-top:10px;border-radius:6px;">` : ""}
      <small>By ${post.author}</small>
    `;
    profilePosts.appendChild(postDiv);
  }

  // Xử lý nút Follow / Unfollow
  const followBtn = document.getElementById("followBtn");
  if (userAddress.toLowerCase() === address.toLowerCase()) {
    followBtn.style.display = "none";
  } else {
    const isFollowing = await vinSocialContract.isFollowing(userAddress, address);
    followBtn.innerText = isFollowing ? "Unfollow" : "Follow";
    followBtn.style.display = "inline-block";
    followBtn.onclick = async () => {
      try {
        const tx = isFollowing
          ? await vinSocialContract.unfollow(address)
          : await vinSocialContract.follow(address);
        await tx.wait();
        alert(isFollowing ? "Unfollowed" : "Followed");
        viewProfile(address); // Refresh view
      } catch (err) {
        alert("Error: " + err.message);
      }
    };
  }
}
