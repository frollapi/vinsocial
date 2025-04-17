// 👉 VinSocial App.js - Fixed: Add approve() before register

const vinSocialAddress = "0x2DB5a0Dcf2942d552EF02D683b4d5852A7431a87";
const vinTokenAddress = "0x941F63807401efCE8afe3C9d88d368bAA287Fac4";

let provider, signer, userAddress;
let vinSocialContract, vinTokenContract;

const vinSocialAbi = [
  "function registered(address) view returns (bool)",
  "function REGISTRATION_FEE() view returns (uint256)",
  "function register(string,string,string,string) external",
  "function createPost(string,string,string) external",
  "function getUserPosts(address) view returns (uint256[])",
  "function posts(uint256) view returns (address,string,string,string,uint256)",
  "function likePost(uint256) external",
  "function commentOnPost(uint256,string) external",
  "function getComments(uint256) view returns (tuple(address commenter, string message, uint256 timestamp)[])"
];

const vinTokenAbi = [
  "function balanceOf(address) view returns (uint256)",
  "function allowance(address,address) view returns (uint256)",
  "function estimateFee(uint256) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transferFrom(address,address,uint256) returns (bool)"
];

// Format đơn vị
function formatVin(value) {
  return Number(ethers.utils.formatUnits(value, 18)).toFixed(3);
}
function formatVic(value) {
  return Number(ethers.utils.formatUnits(value, 18)).toFixed(5);
}

async function connectWallet() {
  if (!window.ethereum) {
    alert("Please install MetaMask or use a Web3-enabled browser.");
    return;
  }

  provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  signer = provider.getSigner();
  userAddress = await signer.getAddress();

  vinSocialContract = new ethers.Contract(vinSocialAddress, vinSocialAbi, signer);
  vinTokenContract = new ethers.Contract(vinTokenAddress, vinTokenAbi, signer);

  document.getElementById("status").innerText = "Connected: " + userAddress;

  const vinBal = await vinTokenContract.balanceOf(userAddress);
  const vicBal = await provider.getBalance(userAddress);
  document.getElementById("balances").innerText =
    `Balance: ${formatVin(vinBal)} VIN | ${formatVic(vicBal)} VIC`;

  const isRegistered = await vinSocialContract.registered(userAddress);
  if (isRegistered) {
    document.getElementById("registrationForm").style.display = "none";
    document.getElementById("mainApp").style.display = "block";
    loadPosts();
  } else {
    document.getElementById("mainApp").style.display = "none";
    document.getElementById("registrationForm").style.display = "block";
    document.getElementById("status").innerText +=
      "\nYou are not registered. Please complete the form below.";
  }
}

document.getElementById("loginBtn").addEventListener("click", connectWallet);

document.getElementById("registerBtn").addEventListener("click", async () => {
  if (!signer) await connectWallet();

  const isRegistered = await vinSocialContract.registered(userAddress);
  if (isRegistered) {
    alert("You are already registered.");
    document.getElementById("registrationForm").style.display = "none";
    document.getElementById("mainApp").style.display = "block";
    loadPosts();
    return;
  }

  document.getElementById("registrationForm").style.display = "block";
});

document.getElementById("regForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("regName").value.trim();
  if (name.length < 3 || name.length > 30) {
    alert("Display name must be 3–30 characters.");
    return;
  }

  const bio = document.getElementById("regBio").value.trim();
  const avatar = document.getElementById("regAvatar").value.trim();
  const website = document.getElementById("regWebsite").value.trim();

  const fee = await vinSocialContract.REGISTRATION_FEE();
  const est = await vinTokenContract.estimateFee(fee);
  const total = fee.add(est);
  const allowance = await vinTokenContract.allowance(userAddress, vinSocialAddress);
  if (allowance.lt(total)) {
    const approveTx = await vinTokenContract.approve(vinSocialAddress, total);
    await approveTx.wait();
  }

  const tx = await vinSocialContract.register(name, bio, avatar, website);
  await tx.wait();
  alert("Registration successful!");
  location.reload();
});

// Tạo bài viết mới
async function createPost() {
  const title = document.getElementById("postTitle").value.trim();
  const content = document.getElementById("postContent").value.trim();
  const media = document.getElementById("postMedia").value.trim();

  if (!title || !content) {
    alert("Please enter both title and content.");
    return;
  }

  const tx = await vinSocialContract.createPost(title, content, media);
  await tx.wait();
  alert("Post submitted!");
  location.reload();
}

// Load bài viết
async function loadPosts() {
  const feed = document.getElementById("postFeed");
  feed.innerHTML = "";

  const postCount = await vinSocialContract.nextPostId();
  for (let i = postCount - 1; i >= 1; i--) {
    const post = await vinSocialContract.posts(i);
    const user = post.author;
    const title = post.title;
    const content = post.content;
    const media = post.media;

    const liked = await vinSocialContract.hasLiked(i, userAddress);
    const comments = await vinSocialContract.getComments(i);

    const postDiv = document.createElement("div");
    postDiv.className = "post";
    postDiv.innerHTML = `
      <h3>${title}</h3>
      <p>${content}</p>
      ${media ? `<img src="${media}" alt="media" style="max-width:100%;margin-top:10px;border-radius:6px;">` : ""}
      <small>By ${user}</small>
      <div class="actions">
        <button onclick="likePost(${i})" ${liked ? "disabled" : ""}>👍 Like</button>
        <button onclick="sharePost(${i})">🔁 Share</button>
        <button onclick="showCommentBox(${i})">💬 Comment</button>
      </div>
      <div id="comments-${i}" class="comment-section">
        ${comments.map(c => `<div class="comment"><b>${c.commenter}</b>: ${c.message}</div>`).join("")}
        <div id="comment-box-${i}" style="display:none;margin-top:8px;">
          <input type="text" id="comment-input-${i}" placeholder="Write a comment..." />
          <button onclick="submitComment(${i})">Send</button>
        </div>
      </div>
    `;
    feed.appendChild(postDiv);
  }
}

// Like
async function likePost(id) {
  const tx = await vinSocialContract.likePost(id);
  await tx.wait();
  alert("Liked!");
  loadPosts();
}

// Share
async function sharePost(id) {
  const tx = await vinSocialContract.sharePost(id);
  await tx.wait();
  alert("Shared!");
  loadPosts();
}

// Comment
function showCommentBox(id) {
  document.getElementById(`comment-box-${id}`).style.display = "block";
}

async function submitComment(id) {
  const msg = document.getElementById(`comment-input-${id}`).value.trim();
  if (!msg) return;
  const tx = await vinSocialContract.commentOnPost(id, msg);
  await tx.wait();
  alert("Commented!");
  loadPosts();
}
