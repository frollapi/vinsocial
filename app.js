// 👉 Địa chỉ hợp đồng và ABI
const vinSocialAddress = "0xeff6a28C1858D6faa95c0813946E9F0020ebf41D";
const vinTokenAddress = "0x941F63807401efCE8afe3C9d88d368bAA287Fac4";

const vinTokenAbi = [
  {"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"value"}],"name":"estimateFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}
];

const vinSocialAbi = [...] // ← nội dung ABI đầy đủ đã được chèn từ file JSON

let provider, signer, userAddress;
let vinSocialContract, vinTokenContract;

// 👉 Hàm khởi động kết nối ví
async function connectWallet() {
  if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    userAddress = await signer.getAddress();

    vinSocialContract = new ethers.Contract(vinSocialAddress, vinSocialAbi, signer);
    vinTokenContract = new ethers.Contract(vinTokenAddress, vinTokenAbi, signer);

    document.getElementById("walletAddress").innerText = userAddress;
    document.getElementById("connectBtn").style.display = "none";
    document.getElementById("walletDetails").style.display = "block";

    await updateBalances();
    checkRegistration();
  } else {
    alert("Please install MetaMask and switch to VIC network.");
  }
}

async function updateBalances() {
  try {
    const vinRaw = await vinTokenContract.balanceOf(userAddress);
    const vicRaw = await provider.getBalance(userAddress);
    const vin = Number(ethers.utils.formatUnits(vinRaw, 18)).toFixed(2);
    const vic = Number(ethers.utils.formatEther(vicRaw)).toFixed(4);

    document.getElementById("vinBalance").innerText = vin + " VIN";
    document.getElementById("vicBalance").innerText = vic + " VIC";
  } catch (err) {
    console.error("Balance error:", err);
  }
}

function disconnectWallet() {
  provider = null;
  signer = null;
  userAddress = null;
  document.getElementById("walletDetails").style.display = "none";
  document.getElementById("connectBtn").style.display = "inline-block";
}

document.getElementById("connectBtn").addEventListener("click", connectWallet);
document.getElementById("disconnectBtn").addEventListener("click", disconnectWallet);

