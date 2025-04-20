// 👉 VinSocial v2 - app.js hoàn chỉnh (không đếm view tự động, tối ưu gas)

const vinSocialAddress = "0xA86598807da8C76c5273A06d01C521252D5CDd17";
const vinTokenAddress = "0x941F63807401efCE8afe3C9d88d368bAA287Fac4";

let provider, signer, userAddress;
let vinSocialContract, vinTokenContract, vinSocialReadOnly;
let isRegistered = false;
let lastPostId = 0;
let seen = new Set();

const vinTokenAbi = [
  "function balanceOf(address account) view returns (uint256)",
  "function approve(address spender, uint256 amount) external returns (bool)"
];

const vinSocialAbi = [
  "function isRegistered(address) view returns (bool)",
  "function register(string,string,string,string) external",
  "function createPost(string,string,string) external",
  "function likePost(uint256) external",
  "function commentOnPost(uint256,string) external",
  "function sharePost(uint256) external",
  "function follow(address) external",
  "function unfollow(address) external",
  "function getUserPosts(address) view returns (uint256[])",
  "function getComments(uint256) view returns (tuple(address commenter,string message,uint256 timestamp)[])",
  "function posts(uint256) view returns (address,string,string,string,uint256)",
  "function users(address) view returns (string,string,string,string)",
  "function nextPostId() view returns (uint256)",
  "function likeCount(uint256) view returns (uint256)",
  "function shareCount(uint256) view returns (uint256)",
  "function viewCount(uint256) view returns (uint256)",
  "function getFollowers(address) view returns (address[])",
  "function getFollowing(address) view returns (address[])"
];

window.onload = async () => {
  if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    vinSocialReadOnly = new ethers.Contract(vinSocialAddress, vinSocialAbi, provider);
    await tryAutoConnect();
  } else {
    provider = new ethers.providers.JsonRpcProvider();
    vinSocialReadOnly = new ethers.Contract(vinSocialAddress, vinSocialAbi, provider);
    showHome(true);
  }
};

async function connectWallet() {
  await provider.send("eth_requestAccounts", []);
  signer = provider.getSigner();
  userAddress = await signer.getAddress();
  await setupContracts();
  vinSocialReadOnly = new ethers.Contract(vinSocialAddress, vinSocialAbi, provider);
  await updateUI();
}

function disconnectWallet() {
  userAddress = null;
  isRegistered = false;
  document.getElementById("walletAddress").innerText = "Not connected";
  document.getElementById("connectBtn").style.display = "inline-block";
  document.getElementById("disconnectBtn").style.display = "none";
  document.getElementById("mainNav").style.display = "none";
  document.getElementById("mainContent").innerHTML = `<p class='tip'>Tip: Use VIC chain in MetaMask. On mobile, open in the wallet's browser (e.g. Viction, MetaMask).</p>`;
}

async function setupContracts() {
  vinSocialContract = new ethers.Contract(vinSocialAddress, vinSocialAbi, signer);
  vinTokenContract = new ethers.Contract(vinTokenAddress, vinTokenAbi, signer);
}

async function tryAutoConnect() {
  const accounts = await provider.send("eth_accounts", []);
  if (accounts.length > 0) {
    userAddress = accounts[0];
    signer = provider.getSigner();
    await setupContracts();
    await updateUI();
  }
}

async function updateUI() {
  const vinBal = await vinTokenContract.balanceOf(userAddress);
  const vicBal = await provider.getBalance(userAddress);
  const vin = parseFloat(ethers.utils.formatEther(vinBal)).toFixed(2);
  const vic = parseFloat(ethers.utils.formatEther(vicBal)).toFixed(4);
  document.getElementById("walletAddress").innerText = `${shorten(userAddress)} | ${vin} VIN | ${vic} VIC`;
  document.getElementById("connectBtn").style.display = "none";
  document.getElementById("disconnectBtn").style.display = "inline-block";
  isRegistered = await vinSocialContract.isRegistered(userAddress);
  updateMenu();
  showHome(true);
}

function shorten(addr) {
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

function updateMenu() {
  const nav = document.getElementById("mainNav");
  nav.style.display = "flex";
  if (isRegistered) {
    nav.innerHTML = `
      <button class="nav-btn" onclick="showHome(true)">🏠 Home</button>
      <button class="nav-btn" onclick="showProfile()">👤 My Profile</button>
      <button class="nav-btn" onclick="showNewPost()">✍️ New Post</button>
    `;
  } else {
    nav.innerHTML = `
      <button class="nav-btn" onclick="showHome(true)">🏠 Home</button>
      <button class="nav-btn" onclick="showRegister()">📝 Register</button>
    `;
  }
}

document.getElementById("connectBtn").onclick = connectWallet;
document.getElementById("disconnectBtn").onclick = disconnectWallet;

// 👉 Hiển thị bài viết mới nhất (❤️/🔁/👁️ – không gọi viewPost)
async function showHome(reset = false) {
  if (reset) {
    lastPostId = 0;
    seen.clear();
    document.getElementById("mainContent").innerHTML = `<h2>Latest Posts</h2>`;
  }

  let html = "";
  if (lastPostId === 0) {
    try {
      const next = await vinSocialReadOnly.nextPostId();
      lastPostId = next.toNumber();
    } catch (e) {
      console.error("Cannot fetch nextPostId", e);
      return;
    }
  }

  let i = lastPostId - 1;
  let loaded = 0;

  while (i > 0 && loaded < 5) {
    if (seen.has(i)) {
      i--;
      continue;
    }

    try {
      const post = await vinSocialReadOnly.posts(i);
      if (post[0] === "0x0000000000000000000000000000000000000000" || post[4] === 0) {
        seen.add(i);
        i--;
        continue;
      }

      const key = `${post[1]}|${post[2]}|${post[4]}`;
      if (seen.has(key)) {
        i--;
        continue;
      }

      seen.add(i);
      seen.add(key);

      const author = shorten(post[0]);
      const title = post[1];
      const content = post[2];
      const media = post[3];
      const time = new Date(post[4] * 1000).toLocaleString();

      const [likes, shares, views] = await Promise.all([
        vinSocialReadOnly.likeCount(i),
        vinSocialReadOnly.shareCount(i),
        vinSocialReadOnly.viewCount(i)
      ]);

      html += `
        <div class="post">
          <div class="title">${title}</div>
          <div class="author">${author} • ${time}</div>
          <div class="content">${content}</div>
          ${media ? `<img src="${media}" alt="media"/>` : ""}
          <div class="metrics">❤️ ${likes} • 🔁 ${shares} • 👁️ ${views}</div>
          <div class="actions">
            ${isRegistered ? `
              <button onclick="likePost(${i})">👍 Like</button>
              <button onclick="showComments(${i})">💬 Comment</button>
              <button onclick="sharePost(${i})">🔁 Share</button>` : ""}
            <button onclick="viewProfile('${post[0]}')">👤 Profile</button>
            <button onclick="translatePost(\`${content}\`)">🌐 Translate</button>
          </div>
          <div id="comments-${i}"></div>
        </div>
      `;
      loaded++;
    } catch {}
    i--;
  }

  lastPostId = i + 1;
  document.getElementById("mainContent").innerHTML += html;

  if (lastPostId > 1) {
    document.getElementById("mainContent").innerHTML += `
      <div style="text-align:center; margin-top:10px;">
        <button onclick="showHome()">⬇️ Load More</button>
      </div>
    `;
  }
}

function translatePost(text) {
  const url = `https://translate.google.com/?sl=auto&tl=en&text=${encodeURIComponent(text)}&op=translate`;
  window.open(url, "_blank");
}

function showRegister() {
  if (isRegistered) return alert("You are already registered.");
  document.getElementById("mainContent").innerHTML = `
    <h2>Register Account</h2>
    <form onsubmit="registerUser(); return false;">
      <label>Name*</label><input type="text" id="regName" maxlength="32" required/>
      <label>Bio</label><input type="text" id="regBio" maxlength="160"/>
      <label>Avatar URL</label><input type="text" id="regAvatar"/>
      <label>Website</label><input type="text" id="regWebsite"/>
      <button type="submit">Register (0.05 VIN)</button>
    </form>
  `;
}

async function registerUser() {
  const name = document.getElementById("regName").value.trim();
  const bio = document.getElementById("regBio").value.trim();
  const avatar = document.getElementById("regAvatar").value.trim();
  const website = document.getElementById("regWebsite").value.trim();
  const fee = ethers.utils.parseEther("0.05");

  try {
    const approveTx = await vinTokenContract.approve(vinSocialAddress, fee);
    await approveTx.wait();
    const tx = await vinSocialContract.register(name, bio, avatar, website);
    await tx.wait();
    alert("Registration successful!");
    await updateUI();
  } catch (err) {
    alert("Registration failed.");
    console.error(err);
  }
}

function showNewPost() {
  if (!isRegistered) return alert("You must register to post.");
  document.getElementById("mainContent").innerHTML = `
    <h2>New Post</h2>
    <form onsubmit="createPost(); return false;">
      <label>Title</label><input type="text" id="postTitle" maxlength="80"/>
      <label>What's on your mind?</label><textarea id="postContent" rows="4" maxlength="500"></textarea>
      <label>Image URL (optional)</label><input type="text" id="postMedia"/>
      <button type="submit">Post</button>
    </form>
  `;
}

async function createPost() {
  const title = document.getElementById("postTitle").value.trim();
  const content = document.getElementById("postContent").value.trim();
  const media = document.getElementById("postMedia").value.trim();
  try {
    const tx = await vinSocialContract.createPost(title, content, media);
    await tx.wait();
    alert("Post created!");
    await showHome(true);
  } catch (err) {
    alert("Post failed.");
    console.error(err);
  }
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
    alert("Share failed.");
    console.error(err);
  }
}

async function showComments(postId) {
  const el = document.getElementById(`comments-${postId}`);
  if (el.innerHTML) {
    el.innerHTML = "";
    return;
  }
  const comments = await vinSocialReadOnly.getComments(postId);
  let html = `<div class='comments'><h4>Comments</h4>`;
  comments.forEach(c => {
    html += `<p><strong>${shorten(c.commenter)}:</strong> ${c.message}</p>`;
  });
  if (isRegistered) {
    html += `
      <form onsubmit="addComment(${postId}); return false;">
        <input type="text" id="comment-${postId}" placeholder="Add a comment..." required/>
        <button type="submit">Send</button>
      </form>`;
  } else {
    html += `<p>You must register to comment.</p>`;
  }
  html += `</div>`;
  el.innerHTML = html;
}

async function addComment(postId) {
  const msg = document.getElementById(`comment-${postId}`).value.trim();
  try {
    const tx = await vinSocialContract.commentOnPost(postId, msg);
    await tx.wait();
    alert("Comment added!");
    await showComments(postId);
  } catch (err) {
    alert("Failed to comment.");
    console.error(err);
  }
}

async function viewProfile(addr) {
  try {
    const user = await vinSocialReadOnly.users(addr);
    const posts = await vinSocialReadOnly.getUserPosts(addr);
    const [followers, following] = await Promise.all([
      vinSocialReadOnly.getFollowers(addr),
      vinSocialReadOnly.getFollowing(addr)
    ]);

    let html = `<h2>${user[0]}'s Profile</h2>
      <p><strong>Bio:</strong> ${user[1]}</p>
      <p><strong>Website:</strong> <a href="${user[3]}" target="_blank">${user[3]}</a></p>
      <p>👥 ${followers.length} Followers • ${following.length} Following</p>
      <img src="${user[2]}" alt="avatar" style="max-width:100px;border-radius:50%;margin:10px 0"/>
      <div class="actions">`;

    if (isRegistered && addr.toLowerCase() !== userAddress.toLowerCase()) {
      html += `
        <button onclick="followUser('${addr}')">👤 Follow</button>
        <button onclick="unfollowUser('${addr}')">🙅‍♂️ Unfollow</button>`;
    }

    html += `</div><h3>Posts</h3>`;

    for (const id of posts.reverse()) {
      const post = await vinSocialReadOnly.posts(id);
      const [likes, shares, views] = await Promise.all([
        vinSocialReadOnly.likeCount(id),
        vinSocialReadOnly.shareCount(id),
        vinSocialReadOnly.viewCount(id)
      ]);

      html += `<div class="post">
        <div class="title">${post[1]}</div>
        <div class="author">${shorten(post[0])} • ${new Date(post[4]*1000).toLocaleString()}</div>
        <div class="content">${post[2]}</div>
        ${post[3] ? `<img src="${post[3]}" alt="media"/>` : ""}
        <div class="metrics">❤️ ${likes} • 🔁 ${shares} • 👁️ ${views}</div>
      </div>`;
    }

    document.getElementById("mainContent").innerHTML = html;
  } catch (err) {
    alert("Profile not available.");
    console.error(err);
  }
}

async function showProfile() {
  await viewProfile(userAddress);
}

async function followUser(addr) {
  try {
    const tx = await vinSocialContract.follow(addr);
    await tx.wait();
    alert("Now following!");
    await viewProfile(addr);
  } catch (err) {
    alert("Follow failed.");
    console.error(err);
  }
}

async function unfollowUser(addr) {
  try {
    const tx = await vinSocialContract.unfollow(addr);
    await tx.wait();
    alert("Unfollowed.");
    await viewProfile(addr);
  } catch (err) {
    alert("Unfollow failed.");
    console.error(err);
  }
}

// 👉 Gợi ý người dùng nổi bật (placeholder, có thể nâng cấp sau)
async function suggestUsers() {
  return []; // sau này có thể thêm API: getTopUsers()
}

// 👉 Gợi ý bài viết nổi bật (placeholder, có thể nâng cấp sau)
async function suggestPosts() {
  return []; // sau này có thể thêm API: getTopPosts()
}

// 👉 Tìm kiếm theo ví (hoặc từ khoá mở rộng sau này)
async function searchByAddressOrKeyword(input) {
  if (ethers.utils.isAddress(input)) {
    await viewProfile(input);
  } else {
    alert("Currently only wallet address search is supported.");
    // TODO: sau này có thể tìm theo từ khoá title/content
  }
}
