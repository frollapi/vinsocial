// 👉 Địa chỉ hợp đồng
const vinTokenAddress = "0x941F63807401efCE8afe3C9d88d368bAA287Fac4"; // Token VIN
const vinSocialAddress = "0x2DB5a0Dcf2942d552EF02D683b4d5852A7431a87"; // Contract VinSocial

// 👉 ABI rút gọn
const vinAbi = [
  {
    "inputs": [{"internalType": "address","name": "owner","type": "address"}],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256","name": "","type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
];

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

// 👉 Biến toàn cục
let provider, signer, userAddress;
let vinTokenContract, vinSocialContract;

// 👉 Khi trang tải
window.addEventListener("load", () => {
  if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    document.getElementById("connectWalletBtn").addEventListener("click", connectWallet);
    document.getElementById("disconnectBtn").addEventListener("click", disconnectWallet);
  } else {
    alert("Please install MetaMask to use VinSocial.vin");
  }
});

// 👉 Kết nối ví
async function connectWallet() {
  try {
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    userAddress = await signer.getAddress();

    vinTokenContract = new ethers.Contract(vinTokenAddress, vinAbi, signer);
    vinSocialContract = new ethers.Contract(vinSocialAddress, vinSocialAbi, signer);

    document.getElementById("walletAddress").innerText = `Wallet: ${userAddress}`;
    document.getElementById("connectWalletBtn").style.display = "none";
    document.getElementById("wallet-section").classList.remove("hidden");
    document.getElementById("main-menu").classList.remove("hidden");
    document.getElementById("intro-section").classList.add("hidden");

    await showVinAndVic();
    await checkRegistration(); // phần sau
  } catch (err) {
    console.error("Wallet connection failed", err);
    alert("❌ Failed to connect wallet.");
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

// 👉 Hiển thị số dư VIN và VIC
async function showVinAndVic() {
  try {
    const vinRaw = await vinTokenContract.balanceOf(userAddress);
    const vin = parseFloat(ethers.utils.formatEther(vinRaw));
    document.getElementById("vinBalance").innerText = `VIN: ${vin.toFixed(3)}`;

    const vicRaw = await provider.getBalance(userAddress);
    const vic = parseFloat(ethers.utils.formatEther(vicRaw));
    document.getElementById("vicBalance").innerText = `VIC: ${vic.toFixed(3)}`;
  } catch (err) {
    console.error("Error getting balances", err);
  }
}
