     VinSocial.vin — app.js
   ========================= */

const vinSocialAddress = "0xAdd06EcD128004bFd35057d7a765562feeB77798";
const vinTokenAddress = "0x941F63807401efCE8afe3C9d88d368bAA287Fac4";

let provider, signer, userAddress;
let vinSocialContract, vinTokenContract, vinSocialReadOnly;
let isRegistered = false;
let lastPostId = 0;
let seen = new Set();

const vinTokenAbi = [
  "function balanceOf(address account) view returns (uint256)",
  "function approve(address spender, uint256 amount) external returns (bool)"
];

const tokenAbi = [
  "function balanceOf(address account) view returns (uint256)",
  "function transfer(address recipient, uint256 amount) external returns (bool)",
  "function transferFrom(address sender, address recipient, uint256 amount) external returns (bool)",
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)"
];


// 👉 Tự động giãn chiều cao của textarea khi nhập liệu hoặc dán vào
function autoResize(textarea) {
  // Đặt chiều cao ban đầu là tự động để nó không bị cố định
  textarea.style.height = 'auto';
  // Điều chỉnh chiều cao textarea theo độ cao của nội dung
  textarea.style.height = `${textarea.scrollHeight}px`;
}

// 👉 Đảm bảo nội dung dán vào ô nhập liệu không mất định dạng
document.getElementById('postContent').addEventListener('input', function(event) {
  autoResize(event.target);
});

// CSS thêm vào để giữ định dạng khi dán bài viết
const style = document.createElement('style');
style.innerHTML = `
  #postContent {
    white-space: pre-wrap;  /* Giữ nguyên dấu cách và dòng xuống */
    word-wrap: break-word;  /* Gói từ khi có dấu cách để đảm bảo không tràn */
  }
`;
document.head.appendChild(style);
