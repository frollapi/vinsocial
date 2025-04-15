// 👉 Địa chỉ token VIN
const vinTokenAddress = "0x941F63807401efCE8afe3C9d88d368bAA287Fac4";

// 👉 ABI rút gọn của VIN
const vinAbi = [
  {
    "inputs": [{"internalType":"address","name":"owner","type":"address"}],
    "name": "balanceOf",
    "outputs": [{"internalType":"uint256","name":"","type":"uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
];

// 👉 Biến toàn cục
let provider, signer, userAddress;
let vinTokenContract;

// 👉 Sự kiện khi tải trang
window.addEventListener("load", () => {
  if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
  } else {
    alert("Please install MetaMask to use VinSocial.vin");
    return;
  }

  document.getElementById("connectWalletBtn").addEventListener("click", connectWallet);
  document.getElementById("disconnectBtn").addEventListener("click", disconnectWallet);
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
    document.getElementById("disconnectBtn").style.display = "inline-block";

    await showVinAndVic();
  } catch (err) {
    console.error("Connection failed", err);
    alert("❌ Failed to connect wallet.");
  }
}

// 👉 Ngắt kết nối
function disconnectWallet() {
  signer = null;
  userAddress = null;

  document.getElementById("walletAddress").innerText = "";
  document.getElementById("connectWalletBtn").style.display = "inline-block";
  document.getElementById("disconnectBtn").style.display = "none";

  document.getElementById("vinBalance").innerText = "VIN: --";
  document.getElementById("vicBalance").innerText = "VIC: --";
  document.getElementById("vinPrice").innerText = "1 VIN ≈ $-- USD";
}

// 👉 Hiển thị số dư và giá VIN
async function showVinAndVic() {
  try {
    const vinRaw = await vinTokenContract.balanceOf(userAddress);
    const vin = parseFloat(ethers.utils.formatEther(vinRaw));
    document.getElementById("vinBalance").innerText = `VIN: ${vin.toFixed(3)}`;

    const vicRaw = await provider.getBalance(userAddress);
    const vic = parseFloat(ethers.utils.formatEther(vicRaw));
    document.getElementById("vicBalance").innerText = `VIC: ${vic.toFixed(3)}`;

    const res = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=VICUSDT");
    const data = await res.json();
    const vinPrice = parseFloat(data.price) * 100;
    document.getElementById("vinPrice").innerText = `1 VIN ≈ $${vinPrice.toFixed(2)} USD`;
  } catch (err) {
    console.error("Failed to load balances or price", err);
  }
}
