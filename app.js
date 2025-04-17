// 👉 Replace these with your real contract addresses
const vinSocialAddress = "0x2DB5a0Dcf2942d552EF02D683b4d5852A7431a87"; // 🟢 VinSocial contract address on VIC
const vinTokenAddress = "0x941F63807401efCE8afe3C9d88d368bAA287Fac4";  // 🟢 VIN token contract address on VIC

let provider, signer, userAddress;
let vinSocialContract, vinTokenContract;

const vinSocialAbi = [ /* bạn sẽ dán đầy đủ ABI ở đây sau */ ];

const vinTokenAbi = [
  "function balanceOf(address owner) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function estimateFee(uint256 amount) view returns (uint256)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)"
];

// Kết nối ví và khởi tạo
async function connectWallet() {
  if (!window.ethereum) {
    alert("Please install MetaMask to use VinSocial.");
    return;
  }

  provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  signer = provider.getSigner();
  userAddress = await signer.getAddress();

  document.getElementById("status").innerText = "Connected: " + userAddress;

  vinSocialContract = new ethers.Contract(vinSocialAddress, vinSocialAbi, signer);
  vinTokenContract = new ethers.Contract(vinTokenAddress, vinTokenAbi, signer);

  checkRegistration();
}

// Kiểm tra người dùng đã đăng ký chưa
async function checkRegistration() {
  try {
    const isRegistered = await vinSocialContract.registered(userAddress);
    if (isRegistered) {
      document.getElementById("mainApp").style.display = "block";
      loadPosts();
    } else {
      document.getElementById("mainApp").style.display = "none";
      document.getElementById("status").innerText += "\nYou are not registered. Please register first.";
    }
  } catch (err) {
    console.error("Error checking registration:", err);
    document.getElementById("status").innerText = "Error connecting to contract.";
  }
}

// Gán sự kiện nút
document.getElementById("loginBtn").addEventListener("click", connectWallet);
