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
  "function isUserFollowing(address,address) view returns (bool)"
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

    document.getElementById("vicBalance").innerText = vin + " VIN";
    document.getElementById("vinBalance").innerText = vic + " VIC";
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

// 👉 Hiển thị feed (bài viết của chính mình)
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

      const postEl = document.createElement("div");
      postEl.className = "post";
      postEl.innerHTML = `
        <h3>${post.title}</h3>
        <p>${post.content}</p>
        ${post.media ? `<img src="${post.media}" style="max-width:100%;border-radius:8px;" />` : ""}
        <p><small>By: ${post.author}</small></p>
        <button onclick="likePost(${postId})">👍 Like</button>
        <button onclick="toggleComment(${postId})">💬 Comment</button>
        <button onclick="sharePost(${postId})">🔁 Share</button>
        <div id="commentBox-${postId}" class="hidden">
          <form onsubmit="submitComment(event, ${postId})">
            <input type="text" id="commentInput-${postId}" placeholder="Your comment" required />
            <button type="submit">Send</button>
          </form>
        </div>
      `;
      feedContainer.appendChild(postEl);
    }
  } catch (err) {
    console.error("Feed error:", err);
    feedContainer.innerHTML = "<p>Failed to load posts.</p>";
  }
}

