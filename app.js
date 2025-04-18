// ✅ app.js hoàn chỉnh cho VinSocial.vin – giống Twitter (X), không nhắn tin

const vinSocialAddress = "0xeff6a28C1858D6faa95c0813946E9F0020ebf41D"; // địa chỉ contract mới
const vinTokenAddress = "0x941F63807401efCE8afe3C9d88d368bAA287Fac4"; // token VIN

const vinAbi = [
  "function balanceOf(address) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function estimateFee(uint256 amount) view returns (uint256)"
];

// 👉 ABI rút gọn chỉ lấy các hàm cần thiết của VinSocial
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
  "function users(address) view returns (string name, string bio, string avatarUrl, string website)"
];

let provider, signer, userAddress;
let vinToken, vinSocial;
let registered = false;

window.addEventListener("load", async () => {
  document.getElementById("connectBtn").onclick = connectWallet;
  document.getElementById("disconnectBtn").onclick = () => location.reload();
  document.getElementById("homeBtn").onclick = loadFeed;
  document.getElementById("registerBtn").onclick = showRegistrationForm;
  document.getElementById("postBtn").onclick = showPostForm;
  document.getElementById("regForm").addEventListener("submit", handleRegister);
  document.getElementById("postForm").addEventListener("submit", handleCreatePost);
  document.getElementById("myProfileBtn").onclick = showMyProfile;

  await checkIfConnected();
});

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

async function checkIfConnected() {
  if (window.ethereum && window.ethereum.selectedAddress) {
    await connectWallet();
  }
}

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
}

function showPostForm() {
  if (!registered) return alert("You must register first.");
  document.getElementById("newPostForm").classList.remove("hidden");
  document.getElementById("registrationForm").classList.add("hidden");
}
// 🔄 Tiếp tục phần 2 – đăng ký, đăng bài, feed, profile, tương tác

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

async function loadFeed() {
  const feed = document.getElementById("feed");
  feed.innerHTML = "<p>Loading posts...</p>";

  try {
    let html = "";
    const nextId = await vinSocial.nextPostId ? await vinSocial.nextPostId() : 1000;
    for (let i = nextId - 1; i >= 1; i--) {
      try {
        const post = await vinSocial.posts(i);
        const user = await vinSocial.users(post.author);

        html += `
        <div class="post">
          <h3>${sanitize(post.title)}</h3>
          <p>${sanitize(post.content)}</p>
          ${post.media ? `<img src="${sanitize(post.media)}" class="media" />` : ""}
          <p class="meta">👤 ${user.name || post.author.slice(0, 8)} | 🕒 ${new Date(post.timestamp * 1000).toLocaleString()}</p>
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

function sanitize(str) {
  return str.replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
}

async function renderComments(postId) {
  try {
    const comments = await vinSocial.getComments(postId);
    return comments.map(c => `
      <div class="comment">
        <p>${sanitize(c.message)}</p>
        <small>👤 ${c.commenter.slice(0, 6)} | ${new Date(c.timestamp * 1000).toLocaleString()}</small>
      </div>
    `).join("");
  } catch {
    return "<p>Failed to load comments</p>";
  }
}

function commentPrompt(postId) {
  const msg = prompt("Enter your comment:");
  if (msg) commentOnPost(postId, msg);
}

async function commentOnPost(postId, message) {
  try {
    const tx = await vinSocial.commentOnPost(postId, message);
    await tx.wait();
    alert("Comment posted!");
    await loadFeed();
  } catch (err) {
    console.error("❌ Comment error:", err);
    alert("Failed to comment.");
  }
}

async function likePost(postId) {
  try {
    const tx = await vinSocial.likePost(postId);
    await tx.wait();
    alert("You liked this post.");
  } catch (err) {
    console.error("❌ Like error:", err);
    alert("Failed to like post.");
  }
}
// ✅ Phần 3: hồ sơ cá nhân, follow, share, dịch bài viết, hoàn tất

async function showMyProfile() {
  if (!registered) return alert("You must register first.");
  document.getElementById("profileView").classList.remove("hidden");
  document.getElementById("feed").innerHTML = "";
  document.getElementById("registrationForm").classList.add("hidden");
  document.getElementById("newPostForm").classList.add("hidden");

  const info = await vinSocial.users(userAddress);
  const posts = await vinSocial.getUserPosts(userAddress);

  let htmlInfo = `
    <h2>👤 ${sanitize(info.name)}</h2>
    ${info.avatarUrl ? `<img src="${info.avatarUrl}" class="avatar" />` : ""}
    <p>${sanitize(info.bio)}</p>
    ${info.website ? `<p>🔗 <a href='${info.website}' target='_blank'>${info.website}</a></p>` : ""}
  `;

  let htmlPosts = "<h3>📝 Your Posts</h3>";
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

  document.getElementById("profileInfo").innerHTML = htmlInfo;
  document.getElementById("profilePosts").innerHTML = htmlPosts;
}

async function followUser(addr) {
  try {
    const isFollowing = await vinSocial.isUserFollowing(userAddress, addr);
    if (!isFollowing) {
      const tx = await vinSocial.follow(addr);
      await tx.wait();
      alert("Followed!");
    } else {
      const tx = await vinSocial.unfollow(addr);
      await tx.wait();
      alert("Unfollowed!");
    }
  } catch (err) {
    console.error("❌ Follow error:", err);
    alert("Follow action failed.");
  }
}

async function sharePost(postId) {
  try {
    const tx = await vinSocial.sharePost(postId);
    await tx.wait();
    alert("Shared!");
  } catch (err) {
    console.error("❌ Share error:", err);
    alert("Failed to share post.");
  }
}

function translatePost(text) {
  const url = `https://translate.google.com/?sl=auto&tl=en&text=${encodeURIComponent(text)}`;
  window.open(url, "_blank");
}

console.log("✅ VinSocial frontend loaded.");
