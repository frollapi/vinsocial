const vinSocialAddress = "0xdEDe433305ed14E3791CF5C47F66060F84a68F10";
const vinTokenAddress = "0x941F63807401efCE8afe3C9d88d368bAA287Fac4";

const vinAbi = [
  "function balanceOf(address) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function estimateFee(uint256 amount) view returns (uint256)"
];

const vinSocialAbi = [ /* ← Sẽ được chèn đầy đủ ở phần sau */ ];

let provider, signer, userAddress;
let vinToken, vinSocial;
let registered = false;

window.addEventListener("load", async () => {
  document.getElementById("connectBtn").onclick = connectWallet;
  document.getElementById("disconnectBtn").onclick = () => location.reload();
  document.getElementById("homeBtn").onclick = loadFeed;
  document.getElementById("registerBtn").onclick = showRegistrationForm;
  document.getElementById("postBtn").onclick = showPostForm;

  await checkIfConnected();
});

async function checkIfConnected() {
  if (window.ethereum && window.ethereum.selectedAddress) {
    await connectWallet();
  }
}

async function connectWallet() {
  if (!window.ethereum) {
    alert("Please install MetaMask!");
    return;
  }

  provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  signer = provider.getSigner();
  userAddress = await signer.getAddress();

  vinToken = new ethers.Contract(vinTokenAddress, vinAbi, signer);
  vinSocial = new ethers.Contract(vinSocialAddress, vinSocialAbi, signer);

  document.getElementById("walletAddress").innerText = `Wallet: ${userAddress}`;
  document.getElementById("walletDetails").style.display = "block";
  document.getElementById("connectBtn").style.display = "none";

  await updateBalances();
  await checkRegistration();
  await loadFeed();
}

async function updateBalances() {
  const vinBal = await vinToken.balanceOf(userAddress);
  const vicBal = await provider.getBalance(userAddress);

  document.getElementById("vinBalance").innerText = `${ethers.utils.formatUnits(vinBal, 18)} VIN`;
  document.getElementById("vicBalance").innerText = `${ethers.utils.formatUnits(vicBal, 18)} VIC`;
}

