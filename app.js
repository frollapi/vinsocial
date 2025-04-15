// 👉 Địa chỉ hợp đồng và token VIN
const vinTokenAddress = "0x941F63807401efCE8afe3C9d88d368bAA287Fac4"; // VIN token address

// 👉 ABI rút gọn của VIN token
const vinAbi = [
  {
    "inputs": [{"internalType": "address", "name": "owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
];

// 👉 Biến toàn cục
let provider, signer, userAddress, vinTokenContract;

// 👉 Khi trang tải
window.addEventListener("load", async () => {
  if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    document.getElementById("connectWalletBtn").addEventListener("click", connectWallet);
    document.getElementById("disconnectBtn").addEventListener("click", disconnectWallet);
  } else {
    alert("Please install MetaMask to use VinSocial.vin");
  }
});

document.getElementById("registerBtn").addEventListener("click", async () => {
  const name = document.getElementById("nameInput").value.trim();
  const bio = document.getElementById("bioInput").value.trim();
  const avatar = document.getElementById("avatarInput").value.trim();
  const website = document.getElementById("websiteInput").value.trim();

  if (!name) return alert("Please enter a name");

  try {
    const tx = await vinSocialContract.register(name, bio, avatar, website, {
      value: ethers.utils.parseEther("0.05")
    });
    await tx.wait();
    alert("✅ Registration successful!");
    document.getElementById("registerForm").classList.add("hidden");
    await checkRegistration();
  } catch (err) {
    console.error("Registration failed", err);
    alert("❌ Registration failed. Make sure you have enough VIN and VIC.");
  }
});

// 👉 Kết nối ví
async function connectWallet() {
  try {
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    userAddress = await signer.getAddress();

    vinTokenContract = new ethers.Contract(vinTokenAddress, vinAbi, signer);

    document.getElementById("walletAddress").innerText = `Wallet: ${userAddress}`;
    document.getElementById("connectWalletBtn").style.display = "none";
    document.getElementById("wallet-section").classList.remove("hidden");
    document.getElementById("main-menu").classList.remove("hidden");
    document.getElementById("intro-section").classList.add("hidden");

    await showVinAndVic();
  } catch (err) {
    console.error("Failed to connect wallet:", err);
    alert("❌ Wallet connection failed.");
  }
}

// 👉 Ngắt kết nối
function disconnectWallet() {
  signer = null;
  userAddress = null;

  document.getElementById("walletAddress").innerText = "";
  document.getElementById("wallet-section").classList.add("hidden");
  document.getElementById("main-menu").classList.add("hidden");
  document.getElementById("connectWalletBtn").style.display = "inline-block";
  document.getElementById("intro-section").classList.remove("hidden");
}

// 👉 Hiển thị VIN & VIC
async function showVinAndVic() {
  try {
    const vinRaw = await vinTokenContract.balanceOf(userAddress);
    const vin = parseFloat(ethers.utils.formatEther(vinRaw));
    document.getElementById("vinBalance").innerText = `VIN: ${vin.toFixed(3)}`;

    const vicRaw = await provider.getBalance(userAddress);
    const vic = parseFloat(ethers.utils.formatEther(vicRaw));
    document.getElementById("vicBalance").innerText = `VIC: ${vic.toFixed(3)}`;
  } catch (err) {
    console.error("Failed to load balances", err);
  }
}

// 👉 Địa chỉ hợp đồng VinSocial
const vinSocialAddress = "0x2DB5a0Dcf2942d552EF02D683b4d5852A7431a87"; // cập nhật đúng nếu khác

// 👉 ABI rút gọn của VinSocial
const vinSocialAbi = [
  {
    "inputs": [{"internalType":"address","name":"user","type":"address"}],
    "name":"users",
    "outputs":[
      {"internalType":"bool","name":"isRegistered","type":"bool"},
      {"internalType":"string","name":"name","type":"string"},
      {"internalType":"string","name":"bio","type":"string"},
      {"internalType":"string","name":"avatar","type":"string"},
      {"internalType":"string","name":"website","type":"string"}
    ],
    "stateMutability":"view",
    "type":"function"
  },
  {
    "inputs":[
      {"internalType":"string","name":"name","type":"string"},
      {"internalType":"string","name":"bio","type":"string"},
      {"internalType":"string","name":"avatar","type":"string"},
      {"internalType":"string","name":"website","type":"string"}
    ],
    "name":"register",
    "outputs":[],
    "stateMutability":"payable",
    "type":"function"
  }
];

let vinSocialContract;

// 👉 Gọi sau khi kết nối ví
async function checkRegistration() {
  vinSocialContract = new ethers.Contract(vinSocialAddress, vinSocialAbi, signer);

  try {
    const user = await vinSocialContract.users(userAddress);
    const registered = user.isRegistered;

    if (registered) {
      document.getElementById("registerForm").classList.add("hidden");
      loadUserProfile(user); // Hiện thông tin người dùng
    } else {
      document.getElementById("registerForm").classList.remove("hidden");
      showSection("profile-section");
    }
  } catch (err) {
    console.error("Error checking registration:", err);
  }
}

// 👉 Gọi hàm checkRegistration() sau khi connectWallet()
await checkRegistration();

function loadUserProfile(user) {
  const profile = `
    <p><strong>Name:</strong> ${user.name}</p>
    <p><strong>Bio:</strong> ${user.bio}</p>
    ${user.avatar ? `<img src="${user.avatar}" alt="Avatar" style="max-width:80px;border-radius:8px;">` : ""}
    ${user.website ? `<p><a href="${user.website}" target="_blank">🌐 Website</a></p>` : ""}
  `;
  document.getElementById("profileArea").innerHTML = profile;
}
