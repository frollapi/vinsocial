// 👉 Địa chỉ hợp đồng
const vinSocialAddress = "0xeff6a28C1858D6faa95c0813946E9F0020ebf41D";
const vinTokenAddress = "0x941F63807401efCE8afe3C9d88d368bAA287Fac4";

// 👉 Biến toàn cục
let provider, signer, userAddress;
let vinSocialContract, vinTokenContract;
let isRegistered = false;

// 👉 ABI rút gọn cho VIN Token
const vinTokenAbi = [
  "function balanceOf(address account) view returns (uint256)",
  "function approve(address spender, uint256 amount) external returns (bool)"
];

// 👉 ABI cần thiết cho VinSocial
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
  "function users(address) view returns (string,string,string,string)"
];

// 👉 Khi tải trang xong
window.onload = async () => {
  if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    await tryAutoConnect();
  }
};

// 👉 Kết nối ví
async function connectWallet() {
  await provider.send("eth_requestAccounts", []);
  signer = provider.getSigner();
  userAddress = await signer.getAddress();
  await setupContracts();
  await updateUI();
}

// 👉 Ngắt kết nối (chỉ xóa hiển thị)
function disconnectWallet() {
  userAddress = null;
  isRegistered = false;
  document.getElementById("walletAddress").innerText = "Not connected";
  document.getElementById("connectBtn").style.display = "inline-block";
  document.getElementById("disconnectBtn").style.display = "none";
  document.getElementById("mainNav").style.display = "none";
  document.getElementById("mainContent").innerHTML = `<p class="tip">Tip: Use VIC chain in MetaMask. On mobile, open in the wallet's browser (e.g. Viction, MetaMask).</p>`;
}

// 👉 Cài đặt hợp đồng
async function setupContracts() {
  vinSocialContract = new ethers.Contract(vinSocialAddress, vinSocialAbi, signer);
  vinTokenContract = new ethers.Contract(vinTokenAddress, vinTokenAbi, signer);
}

// 👉 Thử tự kết nối ví nếu có
async function tryAutoConnect() {
  const accounts = await provider.send("eth_accounts", []);
  if (accounts.length > 0) {
    userAddress = accounts[0];
    signer = provider.getSigner();
    await setupContracts();
    await updateUI();
  }
}

// 👉 Cập nhật toàn bộ giao diện
async function updateUI() {
  // Hiển thị địa chỉ + số dư
  const vinBal = await vinTokenContract.balanceOf(userAddress);
  const vicBal = await provider.getBalance(userAddress);
  const vin = parseFloat(ethers.utils.formatEther(vinBal)).toFixed(2);
  const vic = parseFloat(ethers.utils.formatEther(vicBal)).toFixed(4);
  document.getElementById("walletAddress").innerText = `${shorten(userAddress)} | ${vin} VIN | ${vic} VIC`;
  document.getElementById("connectBtn").style.display = "none";
  document.getElementById("disconnectBtn").style.display = "inline-block";

  // Kiểm tra đăng ký
  isRegistered = await vinSocialContract.isRegistered(userAddress);
  updateMenu();

  // Tải nội dung chính
  showHome();
}

// 👉 Rút gọn địa chỉ ví
function shorten(addr) {
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

// 👉 Cập nhật menu theo trạng thái đăng ký
function updateMenu() {
  const nav = document.getElementById("mainNav");
  nav.style.display = "flex";
  if (isRegistered) {
    nav.innerHTML = `
      <button class="nav-btn" onclick="showHome()">🏠 Home</button>
      <button class="nav-btn" onclick="showProfile()">👤 My Profile</button>
      <button class="nav-btn" onclick="showNewPost()">✍️ New Post</button>
    `;
  } else {
    nav.innerHTML = `
      <button class="nav-btn" onclick="showHome()">🏠 Home</button>
      <button class="nav-btn" onclick="showRegister()">📝 Register</button>
    `;
  }
}

// 👉 Gắn nút sự kiện
document.getElementById("connectBtn").onclick = connectWallet;
document.getElementById("disconnectBtn").onclick = disconnectWallet;

// 👉 Hiển thị danh sách bài viết
async function showHome() {
  document.getElementById("mainContent").innerHTML = `<h2>Latest Posts</h2>`;
  let html = "";
  for (let i = 1; i <= 1000; i++) {
  try {
      const post = await vinSocialContract.posts(i);
      if (post[0] === "0x0000000000000000000000000000000000000000" || post[4] === 0) continue;
      const author = shorten(post[0]);
      const title = post[1];
      const content = post[2];
      const media = post[3];
      const time = new Date(post[4] * 1000).toLocaleString();

      html += `
        <div class="post">
          <div class="title">${title}</div>
          <div class="author">${author} • ${time}</div>
          <div class="content">${content}</div>
          ${media ? `<img src="${media}" alt="media"/>` : ""}
          <div class="actions">
            ${isRegistered ? `
              <button onclick="likePost(${i})">👍 Like</button>
              <button onclick="showComments(${i})">💬 Comment</button>
              <button onclick="sharePost(${i})">🔁 Share</button>` : ""}
            <button onclick="viewProfile('${post[0]}')">👤 Profile</button>
            <button onclick="translatePost('${content}')">🌐 Translate</button>
          </div>
          <div id="comments-${i}"></div>
        </div>
      `;
    } catch {
      break;
    }
  }
  document.getElementById("mainContent").innerHTML += html;
}

// 👉 Dịch bài viết
function translatePost(text) {
  const url = `https://translate.google.com/?sl=auto&tl=en&text=${encodeURIComponent(text)}&op=translate`;
  window.open(url, '_blank');
}

// 👉 Hiển thị form đăng ký
function showRegister() {
  if (isRegistered) return alert("You are already registered.");
  document.getElementById("mainContent").innerHTML = `
    <h2>Register Account</h2>
    <form onsubmit="registerUser(); return false;">
      <label>Name*</label>
      <input type="text" id="regName" maxlength="32" required/>
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

// 👉 Gửi đăng ký tài khoản
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

// 👉 Hiển thị form đăng bài
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
  const title = document.getElementById("postTitle").value.trim();
  const content = document.getElementById("postContent").value.trim();
  const media = document.getElementById("postMedia").value.trim();
  try {
    const tx = await vinSocialContract.createPost(title, content, media);
    await tx.wait();
    alert("Post created!");
    await showHome();
  } catch (err) {
    alert("Post failed.");
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
    alert("Failed to like.");
    console.error(err);
  }
}

// 👉 Hiển thị bình luận
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

// 👉 Gửi bình luận
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

// 👉 Xem hồ sơ người khác
async function viewProfile(addr) {
  try {
    const user = await vinSocialContract.users(addr);
    const posts = await vinSocialContract.getUserPosts(addr);

    let html = `<h2>${user[0]}'s Profile</h2>
      <p><strong>Bio:</strong> ${user[1]}</p>
      <p><strong>Website:</strong> <a href="${user[3]}" target="_blank">${user[3]}</a></p>
      <img src="${user[2]}" alt="avatar" style="max-width:100px;border-radius:50%"/>
      <div class="actions">`;

    if (isRegistered && addr.toLowerCase() !== userAddress.toLowerCase()) {
      html += `
        <button onclick="followUser('${addr}')">👤 Follow</button>
        <button onclick="unfollowUser('${addr}')">🙅‍♂️ Unfollow</button>`;
    }

    html += `</div><h3>Posts</h3>`;

    for (const id of posts.reverse()) {
      const post = await vinSocialContract.posts(id);
      html += `<div class="post">
        <div class="title">${post[1]}</div>
        <div class="author">${shorten(post[0])} • ${new Date(post[4]*1000).toLocaleString()}</div>
        <div class="content">${post[2]}</div>
        ${post[3] ? `<img src="${post[3]}" alt="media"/>` : ""}
      </div>`;
    }

    document.getElementById("mainContent").innerHTML = html;
  } catch (err) {
    alert("Profile not available.");
    console.error(err);
  }
}

// 👉 Theo dõi / Bỏ theo dõi
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

// 👉 Hồ sơ cá nhân
async function showProfile() {
  await viewProfile(userAddress);
}
