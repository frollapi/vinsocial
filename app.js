// 👉 Địa chỉ hợp đồng
const vinSocialAddress = "0x2DB5a0Dcf2942d552EF02D683b4d5852A7431a87";
const vinTokenAddress = "0x941F63807401efCE8afe3C9d88d368bAA287Fac4";

// 👉 ABI của VinSocial (rút gọn phần dùng nhiều)
const socialAbi = ;

// 👉 ABI rút gọn của token VIN
const vinAbi = [
  {
    "inputs":[{"internalType":"address","name":"owner","type":"address"}],
    "name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],
    "stateMutability":"view","type":"function"
  },
  {
    "inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],
    "name":"estimateFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],
    "stateMutability":"view","type":"function"
  }
];

let provider, signer, vinToken, contract;
let currentAccount = null;

// 👉 Kết nối MetaMask
async function connectWallet() {
  if (typeof window.ethereum === "undefined") {
    alert("⚠️ Please install MetaMask first.");
    return;
  }

  try {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    currentAccount = await signer.getAddress();

    // Hiển thị địa chỉ
    document.getElementById("walletAddress").innerText = currentAccount;
    document.getElementById("walletInfo").classList.remove("hidden");
    document.getElementById("disconnectBtn").classList.remove("hidden");
    document.getElementById("connectBtn").classList.add("hidden");

    // Load contracts
    vinToken = new ethers.Contract(vinTokenAddress, vinAbi, provider);
    contract = new ethers.Contract(vinSocialAddress, socialAbi, signer);

    await updateBalances();
    loadPosts();
  } catch (err) {
    console.error("❌ Wallet connect error:", err);
    alert("Failed to connect wallet.");
  }
}

// 👉 Ngắt kết nối
function disconnectWallet() {
  currentAccount = null;
  document.getElementById("walletAddress").innerText = "Not connected";
  document.getElementById("walletInfo").classList.add("hidden");
  document.getElementById("disconnectBtn").classList.add("hidden");
  document.getElementById("connectBtn").classList.remove("hidden");
}

// 👉 Gán sự kiện nút
document.getElementById("connectBtn").addEventListener("click", connectWallet);
document.getElementById("disconnectBtn").addEventListener("click", disconnectWallet);
