// 👉 Địa chỉ hợp đồng
const vinSocialAddress = "0xeff6a28C1858D6faa95c0813946E9F0020ebf41D";
const vinTokenAddress = "0x941F63807401efCE8afe3C9d88d368bAA287Fac4";

// 👉 Khởi tạo
let provider, signer, userAddress;
let vinSocialContract, vinTokenContract;
let isRegistered = false;

window.onload = async () => {
  await checkWallet();
};

async function checkWallet() {
  if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    try {
      const accounts = await provider.send("eth_accounts", []);
      if (accounts.length > 0) {
        userAddress = accounts[0];
        document.getElementById("walletAddress").innerText = shorten(userAddress);
        document.getElementById("connectBtn").style.display = "none";
        document.getElementById("disconnectBtn").style.display = "inline-block";
        await setupContracts();
        await checkRegistration();
        await showHome();
      }
    } catch (err) {
      console.error("Wallet check failed", err);
    }
  }
}

async function connectWallet() {
  if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    userAddress = await signer.getAddress();
    document.getElementById("walletAddress").innerText = shorten(userAddress);
    document.getElementById("connectBtn").style.display = "none";
    document.getElementById("disconnectBtn").style.display = "inline-block";
    await setupContracts();
    await checkRegistration();
    await showHome();
  } else {
    alert("Please install MetaMask!");
  }
}

function disconnectWallet() {
  userAddress = null;
  isRegistered = false;
  document.getElementById("walletAddress").innerText = "Not connected";
  document.getElementById("connectBtn").style.display = "inline-block";
  document.getElementById("disconnectBtn").style.display = "none";
  document.getElementById("mainContent").innerHTML = `<p class="tip">Tip: Use VIC chain in MetaMask. On mobile, open in the wallet's browser (e.g. Viction, MetaMask).</p>`;
  document.querySelector("nav").style.display = "none";
}

function shorten(address) {
  return address.slice(0, 6) + "..." + address.slice(-4);
}

// 👉 ABI rút gọn của token VIN
const vinTokenAbi = [
  "function balanceOf(address account) external view returns (uint256)"
];

// 👉 ABI cần thiết của VinSocial
const vinSocialAbi = [
  "function isRegistered(address) view returns (bool)",
  "function register(string name, string bio, string avatarUrl, string website) external",
  "function createPost(string title, string content, string media) external",
  "function likePost(uint256 postId) external",
  "function commentOnPost(uint256 postId, string message) external",
  "function sharePost(uint256 postId) external",
  "function follow(address user) external",
  "function unfollow(address user) external",
  "function getFollowers(address user) view returns (address[])",
  "function getFollowing(address user) view returns (address[])",
  "function getUserPosts(address user) view returns (uint256[])",
  "function getComments(uint256 postId) view returns (tuple(address commenter,string message,uint256 timestamp)[])",
  "function hasLiked(uint256 postId, address user) view returns (bool)",
  "function isUserFollowing(address from, address to) view returns (bool)",
  "function posts(uint256) view returns (address author, string title, string content, string media, uint256 timestamp)",
  "function users(address) view returns (string name, string bio, string avatarUrl, string website)"
];

// 👉 Khởi tạo hợp đồng
async function setupContracts() {
  vinSocialContract = new ethers.Contract(vinSocialAddress, vinSocialAbi, signer);
  vinTokenContract = new ethers.Contract(vinTokenAddress, vinTokenAbi, provider);
  await getBalances();
}

// 👉 Lấy số dư VIN và VIC
async function getBalances() {
  try {
    const vin = await vinTokenContract.balanceOf(userAddress);
    const vic = await provider.getBalance(userAddress);
    const vinFormatted = ethers.utils.formatEther(vin);
    const vicFormatted = ethers.utils.formatEther(vic);
    document.getElementById("walletAddress").innerText =
      `${shorten(userAddress)} | ${parseFloat(vinFormatted).toFixed(2)} VIN | ${parseFloat(vicFormatted).toFixed(4)} VIC`;
  } catch (err) {
    console.error("Error fetching balances:", err);
  }
}

// 👉 Kiểm tra ví đã đăng ký chưa, cập nhật menu
async function registerUser() {
  const name = document.getElementById("regName").value.trim();
  const bio = document.getElementById("regBio").value.trim();
  const avatar = document.getElementById("regAvatar").value.trim();
  const website = document.getElementById("regWebsite").value.trim();

  const REGISTRATION_FEE = ethers.utils.parseEther("0.05");

  try {
    // B1: Approve token VIN cho VinSocial được quyền rút 0.05 VIN
    const approveTx = await vinTokenContract.connect(signer).approve(vinSocialAddress, REGISTRATION_FEE);
    await approveTx.wait();

    // B2: Gọi hàm register sau khi approve
    const tx = await vinSocialContract.register(name, bio, avatar, website);
    await tx.wait();

    alert("Registered successfully!");
    await checkRegistration();
    await showHome();
  } catch (err) {
    alert("Registration failed.");
    console.error(err);
  }
}

// 👉 Hiển thị danh sách bài viết
async function showHome() {
  if (!vinSocialContract) return;
  document.getElementById("mainContent").innerHTML = `<h2>Latest Posts</h2>`;
  try {
    const allPosts = [];
    for (let i = 1; i <= 1000; i++) {
      try {
        const post = await vinSocialContract.posts(i);
        allPosts.push({ id: i, ...post });
      } catch {
        break;
      }
    }
    allPosts.reverse();
    allPosts.forEach(post => {
      const html = `
        <div class="post">
          <div class="title">${post.title}</div>
          <div class="author">${shorten(post.author)} • ${new Date(post.timestamp * 1000).toLocaleString()}</div>
          <div class="content">${post.content}</div>
          ${post.media ? `<img src="${post.media}" alt="media"/>` : ""}
          <div class="actions">
            ${isRegistered ? `<button onclick="likePost(${post.id})">👍 Like</button>
                              <button onclick="showComments(${post.id})">💬 Comment</button>
                              <button onclick="sharePost(${post.id})">🔁 Share</button>` : ""}
            <button onclick="viewProfile('${post.author}')">👤 Profile</button>
            <button onclick="translatePost('${post.content}')">🌐 Translate</button>
          </div>
          <div id="comments-${post.id}"></div>
        </div>`;
      document.getElementById("mainContent").innerHTML += html;
    });
  } catch (err) {
    document.getElementById("mainContent").innerHTML = `<p class="tip">Failed to load posts.</p>`;
    console.error(err);
  }
}

// 👉 Nút dịch bài viết
function translatePost(text) {
  const url = `https://translate.google.com/?sl=auto&tl=en&text=${encodeURIComponent(text)}&op=translate`;
  window.open(url, '_blank');
}

// 👉 Form đăng ký
function showRegister() {
  document.getElementById("mainContent").innerHTML = `
    <h2>Register Account</h2>
    <form onsubmit="registerUser(); return false;">
      <label>Name*</label>
      <input type="text" id="regName" required maxlength="32"/>
      <label>Bio</label>
      <input type="text" id="regBio" maxlength="160"/>
      <label>Avatar URL</label>
      <input type="text" id="regAvatar"/>
      <label>Website</label>
      <input type="text" id="regWebsite"/>
      <button type="submit">Register (0.05 VIN)</button>
    </form>
  `;
}

// 👉 Gửi đăng ký
async function registerUser() {
  const name = document.getElementById("regName").value.trim();
  const bio = document.getElementById("regBio").value.trim();
  const avatar = document.getElementById("regAvatar").value.trim();
  const website = document.getElementById("regWebsite").value.trim();
  try {
    const tx = await vinSocialContract.register(name, bio, avatar, website);
    await tx.wait();
    alert("Registered successfully!");
    await checkRegistration();
    await showHome();
  } catch (err) {
    alert("Registration failed.");
    console.error(err);
  }
}

// 👉 Form đăng bài
function showNewPost() {
  if (!isRegistered) return alert("You must register to post.");
  document.getElementById("mainContent").innerHTML = `
    <h2>New Post</h2>
    <form onsubmit="createPost(); return false;">
      <label>Title</label>
      <input type="text" id="postTitle" maxlength="80"/>
      <label>What's on your mind?</label>
      <textarea id="postContent" rows="4" maxlength="500"></textarea>
      <label>Image URL (optional)</label>
      <input type="text" id="postMedia"/>
      <button type="submit">Post</button>
    </form>
  `;
}

// 👉 Gửi bài viết
async function createPost() {
  const title = document.getElementById("postTitle").value;
  const content = document.getElementById("postContent").value;
  const media = document.getElementById("postMedia").value;
  try {
    const tx = await vinSocialContract.createPost(title, content, media);
    await tx.wait();
    alert("Posted!");
    await showHome();
  } catch (err) {
    alert("Failed to post.");
    console.error(err);
  }
}

// 👉 Thích bài viết
async function likePost(postId) {
  try {
    const tx = await vinSocialContract.likePost(postId);
    await tx.wait();
    alert("Liked!");
  } catch (err) {
    console.error(err);
    alert("Failed to like.");
  }
}

// 👉 Hiển thị & bình luận
async function showComments(postId) {
  const el = document.getElementById(`comments-${postId}`);
  if (el.innerHTML) {
    el.innerHTML = "";
    return;
  }
  const comments = await vinSocialContract.getComments(postId);
  let html = `<div class="comments"><h4>Comments</h4>`;
  comments.forEach(c => {
    html += `<p><strong>${shorten(c.commenter)}:</strong> ${c.message}</p>`;
  });
  html += isRegistered ? `
    <form onsubmit="addComment(${postId}); return false;">
      <input type="text" id="comment-${postId}" placeholder="Add a comment..." required/>
      <button type="submit">Send</button>
    </form>` : `<p>You must register to comment.</p>`;
  html += `</div>`;
  el.innerHTML = html;
}

// 👉 Gửi bình luận
async function addComment(postId) {
  const msg = document.getElementById(`comment-${postId}`).value;
  try {
    const tx = await vinSocialContract.commentOnPost(postId, msg);
    await tx.wait();
    alert("Commented!");
    await showComments(postId);
  } catch (err) {
    alert("Failed to comment.");
    console.error(err);
  }
}

// 👉 Chia sẻ
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

// 👉 Xem profile người khác
async function viewProfile(addr) {
  try {
    const user = await vinSocialContract.users(addr);
    const posts = await vinSocialContract.getUserPosts(addr);
    let html = `<h2>${user.name}'s Profile</h2>
      <p><strong>Bio:</strong> ${user.bio}</p>
      <p><strong>Website:</strong> <a href="${user.website}" target="_blank">${user.website}</a></p>
      <img src="${user.avatarUrl}" alt="avatar" style="max-width:100px;border-radius:50%"/>
      <div class="actions">
        ${isRegistered ? `
          <button onclick="followUser('${addr}')">👤 Follow</button>
          <button onclick="unfollowUser('${addr}')">🙅‍♂️ Unfollow</button>` : ""}
      </div>
      <h3>Posts</h3>`;
    for (const id of posts.reverse()) {
      const post = await vinSocialContract.posts(id);
      html += `<div class="post">
        <div class="title">${post.title}</div>
        <div class="author">${shorten(post.author)} • ${new Date(post.timestamp * 1000).toLocaleString()}</div>
        <div class="content">${post.content}</div>
        ${post.media ? `<img src="${post.media}" alt="media"/>` : ""}
      </div>`;
    }
    document.getElementById("mainContent").innerHTML = html;
  } catch (err) {
    alert("Profile not available.");
    console.error(err);
  }
}

// 👉 Follow / Unfollow
async function followUser(addr) {
  try {
    const tx = await vinSocialContract.follow(addr);
    await tx.wait();
    alert("Following!");
  } catch (err) {
    alert("Follow failed.");
    console.error(err);
  }
}
async function unfollowUser(addr) {
  try {
    const tx = await vinSocialContract.unfollow(addr);
    await tx.wait();
    alert("Unfollowed!");
  } catch (err) {
    alert("Unfollow failed.");
    console.error(err);
  }
}

// 👉 Gắn sự kiện
document.getElementById("connectBtn").onclick = connectWallet;
document.getElementById("disconnectBtn").onclick = disconnectWallet;
