// 👉 Địa chỉ token VIN trên mạng VIC
const vinTokenAddress = "0x941F63807401efCE8afe3C9d88d368bAA287Fac4";

// 👉 ABI đơn giản để đọc số dư VIN
const vinAbi = [
  {
    "inputs": [{"internalType": "address", "name": "owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
];

let provider, signer, userAddress, vinContract;

// 👉 Hàm kết nối ví
async function connectWallet() {
  if (!window.ethereum) {
    alert("Please install MetaMask!");
    return;
  }

  try {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    userAddress = await signer.getAddress();

    const network = await provider.getNetwork();
    if (network.chainId !== 88) {
      alert("Please switch to the VIC network.");
      return;
    }

    document.getElementById("walletAddress").innerText = "Wallet: " + userAddress;

    // 👉 Hiện phần giao diện chính
    document.getElementById("main-app").classList.remove("hidden");

    vinContract = new ethers.Contract(vinTokenAddress, vinAbi, provider);
    await showBalances();
  } catch (err) {
    console.error("Wallet connection error:", err);
    alert("Connection failed. Check Console.");
  }
}

// 👉 Hiển thị số dư VIN và VIC
async function showBalances() {
  try {
    const vinBalance = await vinContract.balanceOf(userAddress);
    const vinAmount = ethers.utils.formatUnits(vinBalance, 18);
    document.getElementById("vinBalance").innerText = `VIN: ${parseFloat(vinAmount).toFixed(4)}`;

    const vicBalance = await provider.getBalance(userAddress);
    const vicAmount = ethers.utils.formatEther(vicBalance);
    document.getElementById("vicBalance").innerText = `VIC: ${parseFloat(vicAmount).toFixed(4)}`;
  } catch (err) {
    console.error("Balance load error:", err);
  }
}

document.getElementById("connectWalletBtn").addEventListener("click", connectWallet);
