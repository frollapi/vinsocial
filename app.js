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
