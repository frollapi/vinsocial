// 🧠 Khai báo địa chỉ hợp đồng và ABI
const CONTRACT_ADDRESS = "0x2DB5a0Dcf2942d552EF02D683b4d5852A7431a87";
const VIN_TOKEN_ADDRESS = "0x941F63807401efCE8afe3C9d88d368bAA287Fac4";
let contract;
let signer;
let provider;
let currentAccount;

// 👇 Hàm kết nối MetaMask
async function connectWallet() {
  if (window.ethereum) {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      provider = new ethers.providers.Web3Provider(window.ethereum);
      signer = provider.getSigner();
      currentAccount = await signer.getAddress();

      // Gọi contract VinSocial
      const abiUrl = "VinSocial_ABI.json"; // ABI bạn lưu cùng thư mục với app.js
      const response = await fetch(abiUrl);
      const abi = await response.json();
      contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

      document.getElementById("walletAddress").innerText = `Wallet: ${currentAccount}`;
    } catch (err) {
      alert("Failed to connect wallet: " + err.message);
    }
  } else {
    alert("Please install MetaMask to use VinSocial.vin");
  }
}

// 📌 Gọi hàm register – chỉ gọi 1 lần duy nhất khi chưa có tài khoản
async function register(name, bio, avatar, website) {
  try {
    const tx = await contract.register(name, bio, avatar, website);
    await tx.wait();
    alert("✅ Account registered successfully!");
  } catch (err) {
    alert("❌ Registration failed: " + err.message);
  }
}

// 📌 Hiện/ẩn form tạo bài khi nhấn Create Post
document.getElementById("createBtn").addEventListener("click", () => {
  const form = document.getElementById("createPostSection");
  form.classList.toggle("hidden");
});

// 📌 Gắn sự kiện khi nhấn nút kết nối ví
document.getElementById("connectBtn").addEventListener("click", connectWallet);

// 📌 Tự kết nối lại nếu đã có ví sẵn
window.addEventListener("load", async () => {
  if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.listAccounts();
    if (accounts.length > 0) {
      await connectWallet();
    }
  }
});

// 📌 Tạo bài viết mới – gọi createPost trong smart contract
document.getElementById("postForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("postTitle").value;
  const content = document.getElementById("postContent").value;
  const media = document.getElementById("mediaUrl").value;

  try {
    const tx = await contract.createPost(title, content, media);
    await tx.wait();
    alert("✅ Post created!");
    loadFeed(); // Sau khi post xong thì load lại danh sách bài
    document.getElementById("postForm").reset(); // Xoá nội dung form
  } catch (err) {
    alert("❌ Failed to post: " + err.message);
  }
});

// 📌 Hiển thị bài viết từ smart contract
async function loadFeed() {
  const feedContainer = document.getElementById("feedContainer");
  feedContainer.innerHTML = ""; // Xoá nội dung cũ

  try {
    const allPosts = [];
    const nextPostId = await contract.nextPostId();
    const latest = Math.min(10, nextPostId.toNumber()); // Hiển thị 10 bài mới nhất

    for (let i = nextPostId - 1; i > nextPostId - latest && i > 0; i--) {
      const post = await contract.posts(i);
      allPosts.push({ id: i, ...post });
    }

    allPosts.forEach((p) => {
      const postEl = document.createElement("div");
      postEl.className = "post";

      postEl.innerHTML = `
        <h3>${p.title}</h3>
        <p>${p.content}</p>
        ${p.media ? `<img src="${p.media}" style="max-width:100%;margin-top:10px;" />` : ""}
        <div class="meta">By: ${p.author}<br/>At: ${new Date(p.timestamp * 1000).toLocaleString()}</div>
      `;
      feedContainer.appendChild(postEl);
    });

  } catch (err) {
    console.error("Failed to load feed:", err);
  }
}

// 📌 (Có thể mở rộng sau) – Chức năng like/comment/follow sẽ bổ sung từng phần

// 📌 Khởi chạy loadFeed khi trang đã kết nối ví
window.addEventListener("load", () => {
  if (window.ethereum) {
    window.ethereum.on("accountsChanged", () => {
      window.location.reload();
    });
  }

  // Đợi 1 chút rồi gọi feed (sau khi connectWallet xong)
  setTimeout(() => {
    loadFeed();
  }, 1000);
});
