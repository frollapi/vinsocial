const vinSocialAddress = "0xdEDe433305ed14E3791CF5C47F66060F84a68F10";
const vinTokenAddress = "0x941F63807401efCE8afe3C9d88d368bAA287Fac4";

const vinAbi = [
  "function balanceOf(address) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function estimateFee(uint256 amount) view returns (uint256)"
];

const vinSocialAbi = [
  { "inputs": [{ "internalType": "address", "name": "_vinToken", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" },
  { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "user", "type": "address" }], "name": "Registered", "type": "event" },
  { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "postId", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "author", "type": "address" }], "name": "PostCreated", "type": "event" },
  { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "postId", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "user", "type": "address" }], "name": "Liked", "type": "event" },
  { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "postId", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "user", "type": "address" }, { "indexed": false, "internalType": "string", "name": "message", "type": "string" }], "name": "Commented", "type": "event" },
  { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "postId", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "user", "type": "address" }], "name": "Shared", "type": "event" },
  { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }], "name": "Followed", "type": "event" },
  { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }], "name": "Unfollowed", "type": "event" },
  { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "vinToken", "outputs": [{ "internalType": "contract IVIN", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "nextPostId", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "REGISTRATION_FEE", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "string", "name": "name", "type": "string" }, { "internalType": "string", "name": "bio", "type": "string" }, { "internalType": "string", "name": "avatarUrl", "type": "string" }, { "internalType": "string", "name": "website", "type": "string" }], "name": "register", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "string", "name": "title", "type": "string" }, { "internalType": "string", "name": "content", "type": "string" }, { "internalType": "string", "name": "media", "type": "string" }], "name": "createPost", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "uint256", "name": "postId", "type": "uint256" }], "name": "likePost", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "uint256", "name": "postId", "type": "uint256" }, { "internalType": "string", "name": "message", "type": "string" }], "name": "commentOnPost", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "uint256", "name": "postId", "type": "uint256" }], "name": "sharePost", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "user", "type": "address" }], "name": "follow", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "user", "type": "address" }], "name": "unfollow", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "user", "type": "address" }], "name": "getFollowers", "outputs": [{ "internalType": "address[]", "name": "", "type": "address[]" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "user", "type": "address" }], "name": "getFollowing", "outputs": [{ "internalType": "address[]", "name": "", "type": "address[]" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "user", "type": "address" }], "name": "getUserPosts", "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "uint256", "name": "postId", "type": "uint256" }], "name": "getComments", "outputs": [{ "components": [{ "internalType": "address", "name": "commenter", "type": "address" }, { "internalType": "string", "name": "message", "type": "string" }, { "internalType": "uint256", "name": "timestamp", "type": "uint256" }], "internalType": "struct VinSocial.Comment[]", "name": "", "type": "tuple[]" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "uint256", "name": "postId", "type": "uint256" }, { "internalType": "address", "name": "user", "type": "address" }], "name": "hasLiked", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }], "name": "isUserFollowing", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }
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

  await checkIfConnected();
});

async function checkIfConnected() {
  if (window.ethereum && window.ethereum.selectedAddress) {
    await connectWallet();
  }
}

async function connectWallet() {
  if (!window.ethereum) {
    alert("Please install MetaMask!");
    return;
  }

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

  document.getElementById("vinBalance").innerText = `${ethers.utils.formatUnits(vinBal, 18)} VIN`;
  document.getElementById("vicBalance").innerText = `${ethers.utils.formatUnits(vicBal, 18)} VIC`;
}

async function checkRegistration() {
  try {
    registered = await vinSocial.registered(userAddress);
    document.getElementById("postBtn").style.display = registered ? "inline-block" : "none";
    document.getElementById("registerBtn").style.display = registered ? "none" : "inline-block";
  } catch (err) {
    console.error("❌ checkRegistration error:", err);
  }
}

function showRegistrationForm() {
  if (!registered) {
    document.getElementById("registrationForm").classList.remove("hidden");
    document.getElementById("newPostForm").classList.add("hidden");
  } else {
    alert("You are already registered.");
  }
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
    registered = true;
    document.getElementById("registrationForm").classList.add("hidden");
    document.getElementById("postBtn").style.display = "inline-block";
    document.getElementById("registerBtn").style.display = "none";
  } catch (err) {
    console.error("❌ Registration failed:", err);
    alert("Registration failed. Please check your balance and gas.");
  }
}

function showPostForm() {
  if (!registered) {
    alert("You must register to post.");
    return;
  }

  document.getElementById("newPostForm").classList.remove("hidden");
  document.getElementById("registrationForm").classList.add("hidden");
}

async function handleCreatePost(e) {
  e.preventDefault();

  const title = document.getElementById("postTitle").value.trim();
  const content = document.getElementById("postContent").value.trim();
  const media = document.getElementById("postMedia").value.trim();

  if (!title || !content) {
    alert("Title and content are required.");
    return;
  }

  try {
    const tx = await vinSocial.createPost(title, content, media);
    await tx.wait();

    alert("✅ Post published!");
    document.getElementById("postForm").reset();
    document.getElementById("newPostForm").classList.add("hidden");
    loadFeed();
  } catch (err) {
    console.error("❌ Post failed:", err);
    alert("Failed to publish post.");
  }
}

async function loadFeed() {
  const feed = document.getElementById("feed");
  feed.innerHTML = "<p>Loading posts...</p>";

  try {
    const postCount = await vinSocial.nextPostId();
    let html = "";

    for (let i = postCount - 1; i >= 1; i--) {
      const post = await vinSocial.posts(i);
      const user = await vinSocial.users(post.author);

      html += `
        <div class="post">
          <h3>${sanitize(post.title)}</h3>
          <p>${sanitize(post.content)}</p>
          ${post.media ? `<img src="${sanitize(post.media)}" class="media" />` : ""}
          <p class="meta">👤 ${user.name || post.author.slice(0, 6)} | ${new Date(post.timestamp * 1000).toLocaleString()}</p>
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
    }

    feed.innerHTML = html || "<p>No posts yet.</p>";
  } catch (err) {
    console.error("❌ Load feed error:", err);
    feed.innerHTML = "<p>Failed to load posts.</p>";
  }
}

function sanitize(str) {
  return str.replace(/[&<>"']/g, function (m) {
    return ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[m];
  });
}

async function renderComments(postId) {
  try {
    const comments = await vinSocial.getComments(postId);
    let html = "";

    for (let c of comments) {
      html += `<div class="comment">
        <p>${sanitize(c.message)}</p>
        <small>👤 ${c.commenter.slice(0, 6)} | ${new Date(c.timestamp * 1000).toLocaleString()}</small>
      </div>`;
    }

    return html;
  } catch (err) {
    console.error("❌ Load comments error:", err);
    return "<p>Failed to load comments</p>";
  }
}

function commentPrompt(postId) {
  const msg = prompt("Enter your comment:");
  if (!msg) return;
  commentOnPost(postId, msg);
}

async function commentOnPost(postId, message) {
  try {
    const tx = await vinSocial.commentOnPost(postId, message);
    await tx.wait();
    alert("Comment posted!");
    loadFeed();
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

async function sharePost(postId) {
  try {
    const tx = await vinSocial.sharePost(postId);
    await tx.wait();
    alert("Post shared.");
  } catch (err) {
    console.error("❌ Share error:", err);
    alert("Failed to share post.");
  }
}

async function followUser(targetAddr) {
  if (targetAddr.toLowerCase() === userAddress.toLowerCase()) {
    alert("You can't follow yourself.");
    return;
  }

  try {
    const isNowFollowing = await vinSocial.isUserFollowing(userAddress, targetAddr);
    const tx = isNowFollowing
      ? await vinSocial.unfollow(targetAddr)
      : await vinSocial.follow(targetAddr);
    await tx.wait();
    alert(isNowFollowing ? "Unfollowed." : "Now following!");
  } catch (err) {
    console.error("❌ Follow error:", err);
    alert("Failed to follow/unfollow.");
  }
}

function translatePost(content) {
  const url = `https://translate.google.com/?sl=auto&tl=en&text=${encodeURIComponent(content)}&op=translate`;
  window.open(url, "_blank");
}

document.getElementById("myProfileBtn").onclick = showMyProfile;

async function showMyProfile() {
  if (!registered) {
    alert("Please register first.");
    return;
  }

  const feed = document.getElementById("feed");
  feed.innerHTML = "<p>Loading your profile...</p>";

  try {
    const posts = await vinSocial.getUserPosts(userAddress);
    const user = await vinSocial.users(userAddress);
    const followers = await vinSocial.getFollowers(userAddress);
    const following = await vinSocial.getFollowing(userAddress);

    let html = `
      <div class="profile">
        <h2>${user.name}</h2>
        ${user.avatarUrl ? `<img src="${sanitize(user.avatarUrl)}" class="avatar" />` : ""}
        <p><strong>Bio:</strong> ${sanitize(user.bio)}</p>
        <p><strong>Website:</strong> <a href="${sanitize(user.website)}" target="_blank">${sanitize(user.website)}</a></p>
        <p><strong>Followers:</strong> ${followers.length} | <strong>Following:</strong> ${following.length}</p>
        <hr/>
        <h3>Your Posts</h3>
    `;

    if (posts.length === 0) {
      html += `<p>No posts yet.</p>`;
    } else {
      for (let i = posts.length - 1; i >= 0; i--) {
        const postId = posts[i];
        const post = await vinSocial.posts(postId);

        html += `
          <div class="post">
            <h3>${sanitize(post.title)}</h3>
            <p>${sanitize(post.content)}</p>
            ${post.media ? `<img src="${sanitize(post.media)}" class="media" />` : ""}
            <p class="meta">🕒 ${new Date(post.timestamp * 1000).toLocaleString()}</p>
            <div class="actions">
              <button onclick="likePost(${postId})">👍 Like</button>
              <button onclick="commentPrompt(${postId})">💬 Comment</button>
              <button onclick="sharePost(${postId})">🔁 Share</button>
              <button onclick="translatePost(\`${sanitize(post.content)}\`)">🌐 Translate</button>
            </div>
            <div id="comments-${postId}" class="comment-section">
              ${await renderComments(postId)}
            </div>
          </div>`;
      }
    }

    html += `</div>`;
    feed.innerHTML = html;
  } catch (err) {
    console.error("❌ Show profile error:", err);
    feed.innerHTML = "<p>Failed to load profile.</p>";
  }
}
