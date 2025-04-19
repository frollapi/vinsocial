// ✅ app.js hoàn chỉnh cho VinSocial.vin – giống X (Twitter), có xem hồ sơ người khác

const vinSocialAddress = "0xeff6a28C1858D6faa95c0813946E9F0020ebf41D";
const vinTokenAddress = "0x941F63807401efCE8afe3C9d88d368bAA287Fac4";

const vinAbi = [
  "function balanceOf(address) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function estimateFee(uint256 amount) view returns (uint256)"
];

const vinSocialAbi = [
  "function isRegistered(address user) view returns (bool)",
  "function register(string,string,string,string)",
  "function createPost(string,string,string)",
  "function likePost(uint256)",
  "function commentOnPost(uint256,string)",
  "function sharePost(uint256)",
  "function follow(address)",
  "function unfollow(address)",
  "function getUserPosts(address) view returns (uint256[] memory)",
  "function getComments(uint256) view returns (tuple(address commenter, string message, uint256 timestamp)[] memory)",
  "function hasLiked(uint256,address) view returns (bool)",
  "function isUserFollowing(address,address) view returns (bool)",
  "function getFollowers(address) view returns (address[] memory)",
  "function getFollowing(address) view returns (address[] memory)",
  "function posts(uint256) view returns (address author, string title, string content, string media, uint256 timestamp)",
  "function users(address) view returns (string name, string bio, string avatarUrl, string website)",
  "function nextPostId() view returns (uint256)"
];

let provider, signer, userAddress;
let vinToken, vinSocial;
let registered = false;

window.addEventListener("load", async () => {
  document.getElementById("connectBtn").onclick = connectWallet;
  document.getElementById("disconnectBtn").onclick = () => location.reload();
  document.getElementById("homeBtn").onclick = () => {
    document.getElementById("feed").style.display = "block";
    document.getElementById("userProfileView").classList.add("hidden");
    loadFeed();
  };
  document.getElementById("registerBtn").onclick = showRegistrationForm;
  document.getElementById("postBtn").onclick = showPostForm;
  document.getElementById("regForm").addEventListener("submit", handleRegister);
  document.getElementById("postForm").addEventListener("submit", handleCreatePost);
  document.getElementById("myProfileBtn").onclick = showMyProfile;
  await checkIfConnected();
});

async function checkIfConnected() {
  provider = new ethers.providers.Web3Provider(window.ethereum || window);
  vinSocial = new ethers.Contract(vinSocialAddress, vinSocialAbi, provider);
  if (window.ethereum && window.ethereum.selectedAddress) {
    await connectWallet();
  } else {
    await loadFeed();
  }
}

async function connectWallet() {
  if (!window.ethereum) return alert("Please install MetaMask!");
  provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  signer = provider.getSigner();
  userAddress = await signer.getAddress();
  vinToken = new ethers.Contract(vinTokenAddress, vinAbi, signer);
  vinSocial = new ethers.Contract(vinSocialAddress, vinSocialAbi, signer);
  document.getElementById("walletAddress").innerText = `Wallet: ${userAddress}`;
  document.getElementById("walletDetails").style.display = "block";
  document.getElementById("connectBtn").style.display = "none";
  await updateBalances();
  await checkRegistration();
  await loadFeed();
}

async function updateBalances() {
  const vinBal = await vinToken.balanceOf(userAddress);
  const vicBal = await provider.getBalance(userAddress);
  document.getElementById("vinBalance").innerText = `${ethers.utils.formatUnits(vinBal, 18).slice(0, 8)} VIN`;
  document.getElementById("vicBalance").innerText = `${ethers.utils.formatUnits(vicBal, 18).slice(0, 8)} VIC`;
}

function sanitize(str) {
  return str.replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
}

// 👉 tiếp tục viết phần còn lại nếu bạn đồng ý
// ✅ app.js hoàn chỉnh cho VinSocial.vin – giống X (Twitter), có xem hồ sơ người khác

// (Phần đầu đã khai báo các biến và contract)

// ...phần trước giữ nguyên...

async function checkRegistration() {
  try {
    registered = await vinSocial.isRegistered(userAddress);
    document.getElementById("postBtn").style.display = registered ? "inline-block" : "none";
    document.getElementById("registerBtn").style.display = registered ? "none" : "inline-block";
  } catch (err) {
    console.error("❌ checkRegistration error:", err);
  }
}

function showRegistrationForm() {
  document.getElementById("registrationForm").classList.remove("hidden");
  document.getElementById("newPostForm").classList.add("hidden");
  document.getElementById("userProfileView").classList.add("hidden");
}

function showPostForm() {
  if (!registered) return alert("You must register first.");
  document.getElementById("newPostForm").classList.remove("hidden");
  document.getElementById("registrationForm").classList.add("hidden");
  document.getElementById("userProfileView").classList.add("hidden");
}

async function handleRegister(e) {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const bio = document.getElementById("bio").value.trim();
  const avatarUrl = document.getElementById("avatarUrl").value.trim();
  const website = document.getElementById("website").value.trim();
  if (!name || name.length > 32) return alert("Please enter a name (max 32 chars).");
  try {
    const fee = ethers.utils.parseUnits("0.05", 18);
    const extra = await vinToken.estimateFee(fee);
    const total = fee.add(extra);
    const allowance = await vinToken.allowance(userAddress, vinSocialAddress);
    if (allowance.lt(total)) {
      const approveTx = await vinToken.approve(vinSocialAddress, total);
      await approveTx.wait();
    }
    const tx = await vinSocial.register(name, bio, avatarUrl, website);
    await tx.wait();
    alert("🎉 Registered successfully!");
    document.getElementById("registerBtn").style.display = "none";
    document.getElementById("postBtn").style.display = "inline-block";
    document.getElementById("registrationForm").classList.add("hidden");
    await checkRegistration();
    await loadFeed();
  } catch (err) {
    console.error("❌ Registration failed:", err);
    alert("Registration failed. Check balance and gas.");
  }
}

async function handleCreatePost(e) {
  e.preventDefault();
  const title = document.getElementById("postTitle").value.trim();
  const content = document.getElementById("postContent").value.trim();
  const media = document.getElementById("postMedia").value.trim();
  if (!title || !content) return alert("Title and content required.");
  try {
    const tx = await vinSocial.createPost(title, content, media);
    await tx.wait();
    alert("✅ Post published!");
    document.getElementById("postForm").reset();
    document.getElementById("newPostForm").classList.add("hidden");
    await loadFeed();
  } catch (err) {
    console.error("❌ Post failed:", err);
    alert("Failed to publish post.");
  }
}

// ✅ Tiếp tục phần 3 – Hiển thị bài viết và xem hồ sơ người khác

async function loadFeed() {
  const feed = document.getElementById("feed");
  feed.innerHTML = "<p>Loading posts...</p>";
  document.getElementById("userProfileView").classList.add("hidden");
  try {
    let html = "";
    const nextId = await vinSocial.nextPostId();
    for (let i = nextId - 1; i >= 1; i--) {
      try {
        const post = await vinSocial.posts(i);
        if (post.author === "0x0000000000000000000000000000000000000000") continue;
        const user = await vinSocial.users(post.author);
        html += `
        <div class="post">
          <h3>${sanitize(post.title)}</h3>
          <p>${sanitize(post.content)}</p>
          ${post.media ? `<img src="${sanitize(post.media)}" class="media" />` : ""}
          <p class="meta">👤 <span class="clickable" onclick="showUserProfile('${post.author}')">${user.name || post.author.slice(0, 8)}</span> | 🕒 ${new Date(post.timestamp * 1000).toLocaleString()}</p>
          <div class="actions">
            ${registered ? `
              <button onclick="likePost(${i})">👍 Like</button>
              <button onclick="commentPrompt(${i})">💬 Comment</button>
              <button onclick="sharePost(${i})">🔁 Share</button>
              <button onclick="followUser('${post.author}')">👤 Follow</button>
            ` : `<small>Connect & register to interact</small>`}
            <button onclick="translatePost(\`${sanitize(post.content)}\`)">🌐 Translate</button>
          </div>
          <div id="comments-${i}" class="comment-section">
            ${await renderComments(i)}
          </div>
        </div>`;
      } catch {}
    }
    feed.innerHTML = html || "<p>No posts yet.</p>";
  } catch (err) {
    console.error("❌ Load feed error:", err);
    feed.innerHTML = "<p>Failed to load posts.</p>";
  }
}

async function showUserProfile(addr) {
  document.getElementById("userProfileView").classList.remove("hidden");
  document.getElementById("feed").innerHTML = "";
  document.getElementById("registrationForm").classList.add("hidden");
  document.getElementById("newPostForm").classList.add("hidden");
  document.getElementById("profileView").classList.add("hidden");

  const info = await vinSocial.users(addr);
  const posts = await vinSocial.getUserPosts(addr);
  const followers = await vinSocial.getFollowers(addr);
  const following = await vinSocial.getFollowing(addr);

  let htmlInfo = `
    <h2>👤 ${sanitize(info.name || addr.slice(0, 8))}</h2>
    ${info.avatarUrl ? `<img src="${info.avatarUrl}" class="avatar" />` : ""}
    <p>${sanitize(info.bio)}</p>
    ${info.website ? `<p>🔗 <a href='${info.website}' target='_blank'>${info.website}</a></p>` : ""}
    <p>👥 Followers: ${followers.length}</p>
    <p>➡️ Following: ${following.length}</p>
  `;

  let htmlPosts = "<h3>📝 Posts</h3>";
  for (let i = posts.length - 1; i >= 0; i--) {
    try {
      const post = await vinSocial.posts(posts[i]);
      htmlPosts += `
        <div class="post">
          <h3>${sanitize(post.title)}</h3>
          <p>${sanitize(post.content)}</p>
          ${post.media ? `<img src="${sanitize(post.media)}" class="media" />` : ""}
          <p class="meta">🕒 ${new Date(post.timestamp * 1000).toLocaleString()}</p>
          <div class="actions">
            <button onclick="likePost(${posts[i]})">👍 Like</button>
            <button onclick="commentPrompt(${posts[i]})">💬 Comment</button>
            <button onclick="sharePost(${posts[i]})">🔁 Share</button>
            <button onclick="translatePost(\`${sanitize(post.content)}\`)">🌐 Translate</button>
          </div>
        </div>`;
    } catch {}
  }

  document.getElementById("userProfileInfo").innerHTML = htmlInfo;
  document.getElementById("userProfilePosts").innerHTML = htmlPosts;
}
