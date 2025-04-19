// 👉 Địa chỉ hợp đồng VinSocial và token VIN
const vinSocialAddress = "0xeff6a28C1858D6faa95c0813946E9F0020ebf41D";
const vinTokenAddress = "0x941F63807401efCE8afe3C9d88d368bAA287Fac4";

// 👉 ABI rút gọn của VinSocial
const vinSocialAbi = [
  "function isRegistered(address) view returns (bool)",
  "function register(string,string,string,string) external",
  "function createPost(string,string,string) external",
  "function getUserPosts(address) view returns (uint256[])",
  "function posts(uint256) view returns (address,string,string,string,uint256)",
  "function likePost(uint256) external",
  "function commentOnPost(uint256,string) external",
  "function getComments(uint256) view returns (tuple(address commenter, string message)[])",
  "function sharePost(uint256) external",
  "function follow(address) external",
  "function unfollow(address) external",
  "function isUserFollowing(address,address) view returns (bool)",
  "function getTotalPosts() view returns (uint256)"
];

// 👉 ABI rút gọn của token VIN (chỉ cần balanceOf)
const vinTokenAbi = [
  "function balanceOf(address) view returns (uint256)"
];

let provider, signer, userAddress;
let vinSocialContract, vinTokenContract;

// 👉 Kết nối ví MetaMask
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
    loadFeed(); // Tải feed sau khi kết nối
  } else {
    alert("Please install MetaMask and connect to the VIC network.");
  }
}

// 👉 Lấy số dư VIN và VIC
async function updateBalances() {
  try {
    const vicRaw = await provider.getBalance(userAddress);
    const vic = Number(ethers.utils.formatEther(vicRaw)).toFixed(4);
    const vinRaw = await vinTokenContract.balanceOf(userAddress);
    const vin = Number(ethers.utils.formatUnits(vinRaw, 18)).toFixed(2);

    document.getElementById("vinBalance").innerText = vin + " VIN";
    document.getElementById("vicBalance").innerText = vic + " VIC";
  } catch (err) {
    console.error("Error loading balances:", err);
  }
}

function disconnectWallet() {
  provider = null;
  signer = null;
  userAddress = null;
  document.getElementById("walletDetails").style.display = "none";
  document.getElementById("connectBtn").style.display = "inline-block";
}

document.getElementById("connectBtn").addEventListener("click", connectWallet);
document.getElementById("disconnectBtn").addEventListener("click", disconnectWallet);

// 👉 Kiểm tra người dùng đã đăng ký chưa
async function checkRegistration() {
  const registered = await vinSocialContract.isRegistered(userAddress);
  if (registered) {
    document.getElementById("registerBtn").classList.add("hidden");
    document.getElementById("postBtn").classList.remove("hidden");
  } else {
    document.getElementById("registerBtn").classList.remove("hidden");
    document.getElementById("postBtn").classList.add("hidden");
  }
}

// 👉 Hiện form đăng ký khi bấm nút
document.getElementById("registerBtn").addEventListener("click", () => {
  document.getElementById("registrationForm").classList.toggle("hidden");
});

// 👉 Xử lý đăng ký: chỉ cần gọi register(name, bio, avatar, website)
document.getElementById("regForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const bio = document.getElementById("bio").value;
  const avatarUrl = document.getElementById("avatarUrl").value;
  const website = document.getElementById("website").value;

  try {
    const tx = await vinSocialContract.register(name, bio, avatarUrl, website);
    await tx.wait();
    alert("✅ Registered successfully!");
    document.getElementById("registrationForm").classList.add("hidden");
    document.getElementById("registerBtn").classList.add("hidden");
    document.getElementById("postBtn").classList.remove("hidden");
  } catch (err) {
    console.error("Registration error:", err);
    alert("❌ Registration failed.");
  }
});

// 👉 Mở form đăng bài khi bấm nút Post
document.getElementById("postBtn").addEventListener("click", () => {
  document.getElementById("newPostForm").classList.toggle("hidden");
});

// 👉 Gửi bài viết mới
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
    loadFeed(); // Tải lại danh sách bài viết
  } catch (err) {
    console.error("Post error:", err);
    alert("❌ Failed to post.");
  }
});

// 👉 Hiển thị tất cả bài viết từ mọi người (công khai)
async function loadFeed() {
  const feedContainer = document.getElementById("feed");
  feedContainer.innerHTML = "<p>Loading posts...</p>";

  try {
    const tempProvider = window.ethereum
      ? new ethers.providers.Web3Provider(window.ethereum)
      : new ethers.providers.JsonRpcProvider("https://rpc.viction.xyz"); // fallback nếu chưa kết nối ví

    const contract = new ethers.Contract(vinSocialAddress, vinSocialAbi, tempProvider);
    const total = await contract.getTotalPosts();

    if (total === 0) {
      feedContainer.innerHTML = "<p>No posts yet.</p>";
      return;
    }

    feedContainer.innerHTML = "";

    for (let i = total - 1; i >= 0; i--) {
      const post = await contract.posts(i);

      const postEl = document.createElement("div");
      postEl.className = "post";
      postEl.innerHTML = `
        <h3>${post.title}</h3>
        <p>${post.content}</p>
        ${post.media ? `<img src="${post.media}" style="max-width:100%;border-radius:8px;" />` : ""}
        <p><small>By: ${post.author}</small></p>
        ${userAddress ? `
          <button onclick="likePost(${i})">👍 Like</button>
          <button onclick="toggleComment(${i})">💬 Comment</button>
          <button onclick="sharePost(${i})">🔁 Share</button>
          <div id="commentBox-${i}" class="hidden">
            <form onsubmit="submitComment(event, ${i})">
              <input type="text" id="commentInput-${i}" placeholder="Your comment" required />
              <button type="submit">Send</button>
            </form>
          </div>
        ` : ""}
      `;
      feedContainer.appendChild(postEl);
    }
  } catch (err) {
    console.error("Feed error:", err);
    feedContainer.innerHTML = "<p>Failed to load posts.</p>";
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
    loadFeed(); // tải lại để thấy comment mới
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

// 👉 Hiện lại feed khi bấm nút Home
document.getElementById("homeBtn").addEventListener("click", () => {
  document.getElementById("feed").style.display = "block";
  document.getElementById("profileView").classList.add("hidden");
  document.getElementById("userProfileView").classList.add("hidden");
  loadFeed();
});

// 👉 Xem hồ sơ cá nhân
document.getElementById("myProfileBtn").addEventListener("click", async () => {
  document.getElementById("feed").style.display = "none";
  document.getElementById("userProfileView").classList.add("hidden");
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

// 👉 Xem hồ sơ người khác (có nút follow/unfollow)
async function viewUserProfile(address) {
  document.getElementById("feed").style.display = "none";
  document.getElementById("profileView").classList.add("hidden");
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

// 👉 Theo dõi / bỏ theo dõi người khác
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
    viewUserProfile(address); // refresh lại profile
  } catch (err) {
    console.error("Follow error:", err);
    alert("❌ Failed to follow/unfollow.");
  }
}
