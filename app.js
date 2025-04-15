// ✅ Địa chỉ contract
const vinSocialAddress = "0x2DB5a0Dcf2942d552EF02D683b4d5852A7431a87";
const vinTokenAddress = "0x941F63807401efCE8afe3C9d88d368bAA287Fac4";

// ✅ ABI của hợp đồng VinSocial
const socialAbi = [
  {
    "inputs":[
      {"internalType":"address","name":"_vinToken","type":"address"}
    ],
    "stateMutability":"nonpayable","type":"constructor"
  },
  {
    "anonymous":false,"inputs":[
      {"indexed":true,"internalType":"address","name":"user","type":"address"}
    ],
    "name":"Registered","type":"event"
  },
  {
    "anonymous":false,"inputs":[
      {"indexed":true,"internalType":"uint256","name":"postId","type":"uint256"},
      {"indexed":true,"internalType":"address","name":"author","type":"address"}
    ],
    "name":"PostCreated","type":"event"
  },
  {
    "anonymous":false,"inputs":[
      {"indexed":true,"internalType":"uint256","name":"postId","type":"uint256"},
      {"indexed":true,"internalType":"address","name":"user","type":"address"}
    ],
    "name":"Liked","type":"event"
  },
  {
    "anonymous":false,"inputs":[
      {"indexed":true,"internalType":"uint256","name":"postId","type":"uint256"},
      {"indexed":true,"internalType":"address","name":"user","type":"address"},
      {"indexed":false,"internalType":"string","name":"message","type":"string"}
    ],
    "name":"Commented","type":"event"
  },
  {
    "anonymous":false,"inputs":[
      {"indexed":true,"internalType":"uint256","name":"postId","type":"uint256"},
      {"indexed":true,"internalType":"address","name":"user","type":"address"}
    ],
    "name":"Shared","type":"event"
  },
  {
    "anonymous":false,"inputs":[
      {"indexed":true,"internalType":"address","name":"from","type":"address"},
      {"indexed":true,"internalType":"address","name":"to","type":"address"}
    ],
    "name":"Followed","type":"event"
  },
  {
    "anonymous":false,"inputs":[
      {"indexed":true,"internalType":"address","name":"from","type":"address"},
      {"indexed":true,"internalType":"address","name":"to","type":"address"}
    ],
    "name":"Unfollowed","type":"event"
  },
  {
    "inputs":[],"name":"nextPostId",
    "outputs":[{"internalType":"uint256","name":"","type":"uint256"}],
    "stateMutability":"view","type":"function"
  },
  {
    "inputs":[],"name":"owner",
    "outputs":[{"internalType":"address","name":"","type":"address"}],
    "stateMutability":"view","type":"function"
  },
  {
    "inputs":[
      {"internalType":"string","name":"name","type":"string"},
      {"internalType":"string","name":"bio","type":"string"},
      {"internalType":"string","name":"avatarUrl","type":"string"},
      {"internalType":"string","name":"website","type":"string"}
    ],
    "name":"register","outputs":[],"stateMutability":"nonpayable","type":"function"
  },
  {
    "inputs":[
      {"internalType":"string","name":"title","type":"string"},
      {"internalType":"string","name":"content","type":"string"},
      {"internalType":"string","name":"media","type":"string"}
    ],
    "name":"createPost","outputs":[],"stateMutability":"nonpayable","type":"function"
  },
  {
    "inputs":[{"internalType":"uint256","name":"postId","type":"uint256"}],
    "name":"likePost","outputs":[],"stateMutability":"nonpayable","type":"function"
  },
  {
    "inputs":[
      {"internalType":"uint256","name":"postId","type":"uint256"},
      {"internalType":"string","name":"message","type":"string"}
    ],
    "name":"commentOnPost","outputs":[],"stateMutability":"nonpayable","type":"function"
  },
  {
    "inputs":[{"internalType":"uint256","name":"postId","type":"uint256"}],
    "name":"sharePost","outputs":[],"stateMutability":"nonpayable","type":"function"
  },
  {
    "inputs":[{"internalType":"address","name":"user","type":"address"}],
    "name":"follow","outputs":[],"stateMutability":"nonpayable","type":"function"
  },
  {
    "inputs":[{"internalType":"address","name":"user","type":"address"}],
    "name":"unfollow","outputs":[],"stateMutability":"nonpayable","type":"function"
  },
  {
    "inputs":[{"internalType":"uint256","name":"postId","type":"uint256"}],
    "name":"getComments",
    "outputs":[
      {"components":[
        {"internalType":"address","name":"commenter","type":"address"},
        {"internalType":"string","name":"message","type":"string"},
        {"internalType":"uint256","name":"timestamp","type":"uint256"}
      ],
      "internalType":"struct VinSocial.Comment[]","name":"","type":"tuple[]"}
    ],
    "stateMutability":"view","type":"function"
  },
  {
    "inputs":[{"internalType":"address","name":"user","type":"address"}],
    "name":"getUserPosts",
    "outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],
    "stateMutability":"view","type":"function"
  },
  {
    "inputs":[
      {"internalType":"uint256","name":"postId","type":"uint256"},
      {"internalType":"address","name":"user","type":"address"}
    ],
    "name":"hasLiked",
    "outputs":[{"internalType":"bool","name":"","type":"bool"}],
    "stateMutability":"view","type":"function"
  },
  {
    "inputs":[
      {"internalType":"address","name":"from","type":"address"},
      {"internalType":"address","name":"to","type":"address"}
    ],
    "name":"isFollowing",
    "outputs":[{"internalType":"bool","name":"","type":"bool"}],
    "stateMutability":"view","type":"function"
  },
  {
    "inputs":[{"internalType":"address","name":"","type":"address"}],
    "name":"registered",
    "outputs":[{"internalType":"bool","name":"","type":"bool"}],
    "stateMutability":"view","type":"function"
  }
];

let provider, signer, contract, vinToken;
let currentAccount = null;

// ✅ ABI chuẩn rút gọn của token VIN (ERC20 + estimateFee)
const vinAbi = [
  {
    "inputs":[{"internalType":"address","name":"owner","type":"address"}],
    "name":"balanceOf",
    "outputs":[{"internalType":"uint256","name":"","type":"uint256"}],
    "stateMutability":"view","type":"function"
  },
  {
    "inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],
    "name":"estimateFee",
    "outputs":[{"internalType":"uint256","name":"","type":"uint256"}],
    "stateMutability":"view","type":"function"
  }
];

// ✅ Load contract VIN và VinSocial
async function loadContracts() {
  vinToken = new ethers.Contract(vinTokenAddress, vinAbi, provider);
  contract = new ethers.Contract(vinSocialAddress, socialAbi, signer);
}

// ✅ Lấy số dư VIN và VIC
async function updateBalances() {
  if (!currentAccount || !provider) return;

  try {
    const vin = await vinToken.balanceOf(currentAccount);
    const vinValue = ethers.utils.formatUnits(vin, 18);
    document.getElementById("vinBalance").innerText = `${parseFloat(vinValue).toFixed(4)} VIN`;

    const vic = await provider.getBalance(currentAccount);
    const vicValue = ethers.utils.formatEther(vic);
    document.getElementById("vicBalance").innerText = `${parseFloat(vicValue).toFixed(4)} VIC`;
  } catch (err) {
    console.error("Error fetching balances:", err);
  }
}

// 👉 Gửi bài viết mới
document.getElementById("postForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!currentAccount) return alert("Please connect your wallet first.");

  const title = document.getElementById("postTitle").value.trim();
  const content = document.getElementById("postContent").value.trim();
  const media = document.getElementById("mediaUrl").value.trim();

  if (!title || !content) return alert("Please enter both title and content.");

  try {
    const tx = await contract.createPost(title, content, media);
    await tx.wait();
    alert("✅ Post published!");
    document.getElementById("postForm").reset();
    loadPosts(); // Refresh feed
  } catch (err) {
    console.error("❌ Failed to publish post:", err);
    alert("Failed to publish post.");
  }
});

// 👉 Load feed các bài viết mới nhất
async function loadPosts() {
  if (!contract) return;

  const feedContainer = document.getElementById("feedContainer");
  feedContainer.innerHTML = "<p>Loading posts...</p>";

  try {
    const latestId = await contract.nextPostId();
    const max = latestId.toNumber();

    feedContainer.innerHTML = "";

    for (let id = max - 1; id >= Math.max(1, max - 10); id--) {
      const post = await contract.posts(id);
      const postHtml = `
        <div class="post">
          <h3>${post.title}</h3>
          <p>${post.content}</p>
          ${post.media ? `<p><a href="${post.media}" target="_blank">Media Link</a></p>` : ""}
          <div class="meta">Posted by ${shortAddress(post.author)} at ${formatDate(post.timestamp)}</div>
        </div>
      `;
      feedContainer.innerHTML += postHtml;
    }

    if (max === 1) {
      feedContainer.innerHTML = "<p>No posts yet. Be the first!</p>";
    }
  } catch (err) {
    console.error("Error loading posts:", err);
    feedContainer.innerHTML = "<p>Failed to load posts.</p>";
  }
}

// 👉 Rút gọn địa chỉ ví
function shortAddress(addr) {
  return addr.substring(0, 6) + "..." + addr.slice(-4);
}

// 👉 Định dạng timestamp thành ngày giờ
function formatDate(ts) {
  const d = new Date(ts * 1000);
  return d.toLocaleString();
}

// 👉 Hiển thị các tab: Home, Create Post, Profile (ẩn/hiện khu vực)
document.getElementById("homeBtn").addEventListener("click", () => {
  document.getElementById("createPostSection").classList.add("hidden");
  document.getElementById("feedSection").classList.remove("hidden");
});

document.getElementById("createBtn").addEventListener("click", () => {
  if (!currentAccount) return alert("Please connect your wallet first.");
  document.getElementById("feedSection").classList.add("hidden");
  document.getElementById("createPostSection").classList.remove("hidden");
});

document.getElementById("profileBtn").addEventListener("click", () => {
  alert("🔧 My Profile feature is coming soon!");
});

// 👉 Gọi load bài viết khi trang tải xong
window.addEventListener("load", () => {
  loadPosts();
});
