/* =========================
   VinSocial.vin — app.js
   - Ethers v5 (theo index.html)
   - Hợp đồng VinSocial mới
   - Tối đa 20,000 ký tự + giữ xuống dòng
   - Textarea auto-resize
   - Phí đăng ký: 0.001 VIN (approve + register)
   ========================= */

/* ---------- Network & Addresses ---------- */
const VIC_CHAIN = {
  chainId: "0x58", // 88 dec
  chainName: "Viction Mainnet",
  nativeCurrency: { name: "VIC", symbol: "VIC", decimals: 18 },
  rpcUrls: ["https://rpc.viction.xyz"],
  blockExplorerUrls: ["https://vicscan.xyz"],
};

// ✅ Địa chỉ triển khai mới bạn vừa deploy
const VIN_SOCIAL_ADDR = "0xAdd06EcD128004bFd35057d7a765562feeB77798";
// ✅ Địa chỉ token VIN (VIC mainnet) bạn cung cấp
const VIN_TOKEN_ADDR  = "0x941F63807401efCE8afe3C9d88d368bAA287Fac4";

/* ---------- ABIs ---------- */
// ERC20 tối giản cho approve/balance
const ERC20_ABI = [
  "function approve(address spender, uint256 value) public returns (bool)",
  "function allowance(address owner, address spender) public view returns (uint256)",
  "function balanceOf(address account) public view returns (uint256)",
  "function decimals() public view returns (uint8)"
];

// ABI VinSocial mới (bản bạn vừa xuất)
const VIN_SOCIAL_ABI = [
  {"inputs":[{"internalType":"address","name":"_vinToken","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"postId","type":"uint256"},{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"string","name":"message","type":"string"}],"name":"Commented","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"}],"name":"Followed","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"postId","type":"uint256"},{"indexed":true,"internalType":"address","name":"user","type":"address"}],"name":"Liked","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"postId","type":"uint256"},{"indexed":true,"internalType":"address","name":"author","type":"address"}],"name":"PostCreated","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"}],"name":"Registered","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"postId","type":"uint256"},{"indexed":true,"internalType":"address","name":"user","type":"address"}],"name":"Shared","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"}],"name":"Unfollowed","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"postId","type":"uint256"},{"indexed":true,"internalType":"address","name":"viewer","type":"address"}],"name":"Viewed","type":"event"},
  {"inputs":[],"name":"REGISTRATION_FEE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"postId","type":"uint256"},{"internalType":"string","name":"message","type":"string"}],"name":"commentOnPost","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"comments","outputs":[{"internalType":"address","name":"commenter","type":"address"},{"internalType":"string","name":"message","type":"string"},{"internalType":"uint256","name":"timestamp","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"string","name":"title","type":"string"},{"internalType":"string","name":"content","type":"string"},{"internalType":"string","name":"media","type":"string"}],"name":"createPost","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"follow","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"followers","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"following","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"postId","type":"uint256"}],"name":"getComments","outputs":[{"components":[{"internalType":"address","name":"commenter","type":"address"},{"internalType":"string","name":"message","type":"string"},{"internalType":"uint256","name":"timestamp","type":"uint256"}],"internalType":"struct VinSocial.Comment[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getFollowers","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getFollowing","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getUserPosts","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"postId","type":"uint256"},{"internalType":"address","name":"user","type":"address"}],"name":"hasLiked","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"isFollowing","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"isRegistered","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"}],"name":"isUserFollowing","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"likeCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"postId","type":"uint256"}],"name":"likePost","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"address","name":"","type":"address"}],"name":"liked","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"nextPostId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"posts","outputs":[{"internalType":"address","name":"author","type":"address"},{"internalType":"string","name":"title","type":"string"},{"internalType":"string","name":"content","type":"string"},{"internalType":"string","name":"media","type":"string"},{"internalType":"uint256","name":"timestamp","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"bio","type":"string"},{"internalType":"string","name":"avatarUrl","type":"string"},{"internalType":"string","name":"website","type":"string"}],"name":"register","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"shareCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"postId","type":"uint256"}],"name":"sharePost","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"unfollow","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"userPosts","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"users","outputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"bio","type":"string"},{"internalType":"string","name":"avatarUrl","type":"string"},{"internalType":"string","name":"website","type":"string"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"viewCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"postId","type":"uint256"}],"name":"viewPost","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[],"name":"vinToken","outputs":[{"internalType":"contract IVIN","name":"","type":"address"}],"stateMutability":"view","type":"function"}
];

/* =========================
   VinSocial.vin — app.js (Tiếp theo)
   ========================= */

/* ---------- State ---------- */
let provider, signer, userAddress;
let vinToken, vinSocial;

/* ---------- Helpers ---------- */
const $ = (id) => document.getElementById(id);
function shortAddr(a) { return a ? a.slice(0,6)+"..."+a.slice(-4) : ""; }

/* Auto-resize textarea up to a max height (optional clamp) */
function autoResize(el) {
  el.style.height = "auto";
  el.style.height = Math.min(el.scrollHeight, 1200) + "px"; // 1200px trần an toàn
}

/* ---------- Wallet ---------- */
async function ensureVIC() {
  const eth = window.ethereum;
  if (!eth) throw new Error("No wallet found");
  const chainId = await eth.request({ method: "eth_chainId" });
  if (chainId !== VIC_CHAIN.chainId) {
    try {
      await eth.request({ method: "wallet_switchEthereumChain", params: [{ chainId: VIC_CHAIN.chainId }] });
    } catch (e) {
      if (e && e.code === 4902) {
        await eth.request({ method: "wallet_addEthereumChain", params: [VIC_CHAIN] });
      } else {
        throw e;
      }
    }
  }
}

async function connectWallet() {
  try {
    await ensureVIC();
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    userAddress = await signer.getAddress();
    $("walletAddress").innerText = shortAddr(userAddress);
    $("connectBtn").style.display = "none";
    $("disconnectBtn").style.display = "inline-block";
    initContracts();
    await renderApp();
    fetchBalances(); // Đảm bảo gọi để lấy số dư khi kết nối ví
  } catch (err) {
    alert("Connect failed. Please approve wallet requests and ensure VIC network is selected.");
    console.error(err);
  }
}

function disconnectWallet() {
  provider = undefined;
  signer = undefined;
  userAddress = undefined;
  $("walletAddress").innerText = "Not connected";
  $("walletVIN").innerText = "0 VIN";
  $("walletVIC").innerText = "0 VIC";
  $("connectBtn").style.display = "inline-block";
  $("disconnectBtn").style.display = "none";
  renderApp(); // render chế độ xem công khai
}

/* ---------- Contracts ---------- */
function initContracts() {
  vinToken  = new ethers.Contract(VIN_TOKEN_ADDR, ERC20_ABI, signer || provider);
  vinSocial = new ethers.Contract(VIN_SOCIAL_ADDR, VIN_SOCIAL_ABI, signer || provider);
}

/* ---------- Fetch Balances ---------- */
async function fetchBalances() {
  if (!userAddress) return;

  try {
    // Lấy số dư VIN
    const vinBalance = await vinToken.balanceOf(userAddress);
    const vinDecimal = await vinToken.decimals();
    const vinAmount = ethers.utils.formatUnits(vinBalance, vinDecimal);
    $("walletVIN").innerText = `${vinAmount} VIN`;

    // Lấy số dư VIC (VIC token balance)
    const vicBalance = await provider.getBalance(userAddress);
    const vicAmount = ethers.utils.formatUnits(vicBalance, 18); // VIC luôn có 18 chữ số thập phân
    $("walletVIC").innerText = `${vicAmount} VIC`;
  } catch (err) {
    console.error("Failed to fetch balances", err);
    alert("Error fetching balances.");
  }
}

/* ---------- UI ---------- */
async function renderApp() {
  const main = $("mainContent");
  main.innerHTML = "";

  // Các thao tác nếu đã kết nối ví
  if (userAddress) {
    await fetchBalances();
    let reg = false;
    try {
      reg = await vinSocial.isRegistered(userAddress);
    } catch {}

    if (reg) {
      // Nếu đã đăng ký, hiển thị composer (viết bài)
      const composer = document.createElement("section");
      composer.className = "composer";
      composer.innerHTML = `
        <h3>Create Post</h3>
        <form id="postForm">
          <input id="postTitle" type="text" placeholder="Title (optional)" maxlength="256"/>
          <textarea id="postContent" placeholder="Write something... (max 20,000 chars)" maxlength="20000" rows="4"></textarea>
          <input id="postMedia" type="url" placeholder="Media URL (optional)"/>
          <div class="row">
            <span id="charCount">0 / 20000</span>
            <button type="submit">Post</button>
          </div>
        </form>
      `;
      main.appendChild(composer);

      const ta = $("postContent");
      ta.addEventListener("input", () => {
        $("charCount").innerText = `${ta.value.length} / 20000`;
        autoResize(ta);
      });
      setTimeout(() => autoResize(ta), 0);

      $("postForm").addEventListener("submit", onCreatePost);
    } else {
      // Nếu chưa đăng ký nhưng có ví → hiển thị form đăng ký
      const regBox = document.createElement("section");
      regBox.className = "register";
      regBox.innerHTML = `
        <h3>Register (one-time fee: 0.001 VIN)</h3>
        <form id="regForm">
          <input id="rgName" type="text" placeholder="Name" maxlength="64" required/>
          <input id="rgAvatar" type="url" placeholder="Avatar URL (optional)"/>
          <input id="rgWebsite" type="url" placeholder="Website (optional)"/>
          <textarea id="rgBio" rows="3" maxlength="512" placeholder="Bio (optional)"></textarea>
          <button type="submit">Register (0.001 VIN)</button>
        </form>
        <p class="hint">Registration requires you to approve 0.001 VIN then call register().</p>
      `;
      main.appendChild(regBox);

      const bioTA = $("rgBio");
      bioTA.addEventListener("input", () => autoResize(bioTA));
      setTimeout(() => autoResize(bioTA), 0);

      $("regForm").addEventListener("submit", onRegister);
    }
  } else {
    renderLogin(); // Chưa kết nối ví, chỉ hiển thị đăng nhập
  }
}

/* ---------- Actions ---------- */

// Đăng ký tài khoản
async function onRegister(e) {
  e.preventDefault();
  const name    = $("rgName").value.trim();
  const bio     = $("rgBio").value;            // giữ nguyên \n
  const avatar  = $("rgAvatar").value.trim();
  const website = $("rgWebsite").value.trim();

  if (!signer) return alert("Connect wallet first.");

  try {
    // Approve 0.001 VIN cho VinSocial contract
    const fee = ethers.utils.parseEther("0.001");
    const allowance = await vinToken.allowance(userAddress, VIN_SOCIAL_ADDR);
    if (allowance.lt(fee)) {
      const tx1 = await vinToken.connect(signer).approve(VIN_SOCIAL_ADDR, fee);
      await tx1.wait();
    }

    const tx2 = await vinSocial.connect(signer).register(name, bio, avatar, website);
    await tx2.wait();

    alert("Registered successfully!");
    await renderApp();
  } catch (err) {
    console.error(err);
    alert("Register failed.");
  }
}

