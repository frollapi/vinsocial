const vinSocialAddress = "0x2DB5a0Dcf2942d552EF02D683b4d5852A7431a87";
const vinTokenAddress = "0x941F63807401efCE8afe3C9d88d368bAA287Fac4";

// 👉 Dán đầy đủ ABI của VinSocial vào đây:
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

// 👉 Dùng bản rút gọn của token VIN là đủ:
const vinAbi = [
  "function balanceOf(address) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function estimateFee(uint256 amount) view returns (uint256)"
];

let provider, signer, userAddress, vinSocialContract, vinTokenContract;
let registered = false;

window.addEventListener("load", async () => {
  document.getElementById("connectBtn").onclick = connectWallet;
  document.getElementById("disconnectBtn").onclick = disconnectWallet;
  document.getElementById("registerBtn").onclick = showRegistrationForm;
  document.getElementById("regForm").onsubmit = handleRegister;
  document.getElementById("postBtn").onclick = showPostForm;
  document.getElementById("postForm").onsubmit = handleCreatePost;
  document.getElementById("homeBtn").onclick = loadFeed;

  await checkIfConnected();
});

async function connectWallet() {
  if (!window.ethereum) {
    alert("Please install MetaMask!");
    return;
  }

  provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  signer = provider.getSigner();
  userAddress = await signer.getAddress();

  vinSocialContract = new ethers.Contract(vinSocialAddress, vinSocialAbi, signer);
  vinTokenContract = new ethers.Contract(vinTokenAddress, vinAbi, signer);

  document.getElementById("walletAddress").innerText = `Wallet: ${userAddress}`;
  document.getElementById("walletDetails").style.display = "block";
  document.getElementById("connectBtn").style.display = "none";

  await updateBalances();
  await checkRegistration();
  loadFeed();
}

function disconnectWallet() {
  location.reload();
}

async function updateBalances() {
  const vinBal = await vinTokenContract.balanceOf(userAddress);
  const vicBal = await provider.getBalance(userAddress);

  const vin = ethers.utils.formatUnits(vinBal, 18);
  const vic = ethers.utils.formatUnits(vicBal, 18);

  document.getElementById("vinBalance").innerText = `${Number(vin).toFixed(2)} VIN`;
  document.getElementById("vicBalance").innerText = `${Number(vic).toFixed(4)} VIC`;
}

async function checkIfConnected() {
  if (window.ethereum && window.ethereum.selectedAddress) {
    await connectWallet();
  }
}

async function checkRegistration() {
  try {
    registered = await vinSocialContract.registered(userAddress);
    document.getElementById("postBtn").style.display = registered ? "inline-block" : "none";
  } catch (err) {
    console.log("checkRegistration error:", err);
  }
}

function showRegistrationForm() {
  if (!registered) {
    document.getElementById("registrationForm").style.display = "block";
    document.getElementById("newPostForm").style.display = "none";
  } else {
    alert("You are already registered!");
  }
}

async function handleRegister(e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const bio = document.getElementById("bio").value;
  const avatarUrl = document.getElementById("avatarUrl").value;
  const website = document.getElementById("website").value;

  try {
    const fee = ethers.utils.parseUnits("0.05", 18);
    const extraFee = await vinTokenContract.estimateFee(fee);
    const total = fee.add(extraFee);

    const allowance = await vinTokenContract.allowance(userAddress, vinSocialAddress);
    if (allowance.lt(total)) {
      const approveTx = await vinTokenContract.approve(vinSocialAddress, total);
      await approveTx.wait();
    }

    const tx = await vinSocialContract.register(name, bio, avatarUrl, website);
    await tx.wait();
    alert("Registration successful!");
    registered = true;
    document.getElementById("registrationForm").style.display = "none";
    document.getElementById("postBtn").style.display = "inline-block";
  } catch (err) {
    console.error("Registration error:", err);
    alert("Registration failed");
  }
}

function showPostForm() {
  if (!registered) {
    alert("You must register first.");
    return;
  }
  document.getElementById("newPostForm").style.display = "block";
  document.getElementById("registrationForm").style.display = "none";
}

async function handleCreatePost(e) {
  e.preventDefault();
  const title = document.getElementById("postTitle").value;
  const content = document.getElementById("postContent").value;
  const media = document.getElementById("postMedia").value;

  try {
    const tx = await vinSocialContract.createPost(title, content, media);
    await tx.wait();
    alert("Post created!");
    document.getElementById("postForm").reset();
    document.getElementById("newPostForm").style.display = "none";
    loadFeed();
  } catch (err) {
    console.error("Create post error:", err);
    alert("Failed to post.");
  }
}

async function loadFeed() {
  const feed = document.getElementById("feed");
  feed.innerHTML = "<p>Loading posts...</p>";
  let html = "";

  try {
    const postCount = await vinSocialContract.nextPostId();
    for (let i = postCount - 1; i >= 1; i--) {
      const post = await vinSocialContract.posts(i);
      const user = await vinSocialContract.users(post.author);

      html += `
        <div class="post">
          <h3>${post.title}</h3>
          <p>${post.content}</p>
          ${post.media ? `<img src="${post.media}" style="max-width:100%; border-radius:8px; margin-top:10px"/>` : ""}
          <p><small>👤 ${user.name || post.author.slice(0, 6)} | ${new Date(post.timestamp * 1000).toLocaleString()}</small></p>
          <div class="actions">
            ${registered ? `
              <button onclick="likePost(${i})">👍 Like</button>
              <button onclick="sharePost(${i})">🔁 Share</button>
              <button onclick="commentPrompt(${i})">💬 Comment</button>
              <button onclick="followUser('${post.author}')">👤 Follow</button>
            ` : `<small>Connect and register to interact</small>`}
            <button onclick="translatePost('${post.content.replace(/'/g, "\\'")}')">🌐 Translate</button>
          </div>
          <div class="comment-section" id="comments-${i}">
            ${await renderComments(i)}
          </div>
        </div>
      `;
    }

    feed.innerHTML = html || "<p>No posts yet.</p>";
  } catch (err) {
    console.error("Load feed error:", err);
    feed.innerHTML = "<p>Failed to load posts.</p>";
  }
}

async function renderComments(postId) {
  try {
    const comments = await vinSocialContract.getComments(postId);
    let html = "";
    for (let c of comments) {
      html += `<div class="comment">
        <p>${c.message}</p>
        <small>👤 ${c.commenter.slice(0, 6)} | ${new Date(c.timestamp * 1000).toLocaleString()}</small>
      </div>`;
    }
    return html;
  } catch (err) {
    return "<p>Failed to load comments</p>";
  }
}

function translatePost(content) {
  const url = `https://translate.google.com/?sl=auto&tl=en&text=${encodeURIComponent(content)}&op=translate`;
  window.open(url, "_blank");
}

async function likePost(postId) {
  try {
    const tx = await vinSocialContract.likePost(postId);
    await tx.wait();
    alert("Liked!");
  } catch (err) {
    alert("Failed to like.");
    console.error(err);
  }
}

async function sharePost(postId) {
  try {
    const tx = await vinSocialContract.sharePost(postId);
    await tx.wait();
    alert("Post shared!");
  } catch (err) {
    alert("Failed to share.");
    console.error(err);
  }
}

function commentPrompt(postId) {
  const msg = prompt("Enter your comment:");
  if (!msg) return;
  commentOnPost(postId, msg);
}

async function commentOnPost(postId, message) {
  try {
    const tx = await vinSocialContract.commentOnPost(postId, message);
    await tx.wait();
    alert("Commented!");
    loadFeed();
  } catch (err) {
    alert("Failed to comment.");
    console.error(err);
  }
}

async function followUser(userAddr) {
  if (userAddr.toLowerCase() === userAddress.toLowerCase()) {
    alert("You can't follow yourself.");
    return;
  }

  try {
    const isFollowing = await vinSocialContract.isFollowing(userAddress, userAddr);
    const tx = isFollowing
      ? await vinSocialContract.unfollow(userAddr)
      : await vinSocialContract.follow(userAddr);
    await tx.wait();
    alert(isFollowing ? "Unfollowed" : "Followed");
  } catch (err) {
    alert("Failed to follow/unfollow.");
    console.error(err);
  }
}
