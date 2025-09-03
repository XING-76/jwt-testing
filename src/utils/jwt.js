import * as jose from 'jose';
import { PRIVATE_KEY, PUBLIC_KEY } from './keys.js';

/**
 * 生成 JWT Token (使用 RS256 算法)
 * @param {string} userId - 使用者 ID
 * @param {number} expirationSeconds - 創建時間後180秒
 * @returns {Promise<string>} JWT Token
 */
export const generateJWT = async (userId, expirationSeconds = 180) => {
  try {
    if (!userId) {
      throw new Error('使用者 ID 不能為空');
    }

    // 計算時間戳
    const now = Math.floor(Date.now() / 1000);
    const nbf = now - 5; // 創建時間前5秒
    const exp = now + expirationSeconds; // 過期時間

    const payload = {
      sub: userId, // 使用者代碼
      iat: now, // 創建時間
      nbf: nbf, // 時間前不可用
      exp: exp, // 過期時間
    };

    // 使用私鑰進行簽名
    const privateKey = await jose.importPKCS8(PRIVATE_KEY, 'RS256');

    const token = await new jose.SignJWT(payload)
      .setProtectedHeader({
        alg: 'RS256',
        typ: 'JWT',
      })
      .setIssuedAt()
      .setNotBefore(nbf)
      .setExpirationTime(exp)
      .sign(privateKey);

    return token;
  } catch (error) {
    throw new Error(`生成 JWT 時發生錯誤: ${error.message}`);
  }
};

/**
 * 驗證並解密 JWT Token (使用 RS256 算法)
 * @param {string} token - JWT Token
 * @returns {Promise<Object>} 解密的 payload
 */
export const verifyJWT = async (token) => {
  try {
    if (!token) {
      throw new Error('Token 不能為空');
    }

    // 使用公鑰進行驗證
    const publicKey = await importSPKI(PUBLIC_KEY, 'RS256');

    const { payload } = await jwtVerify(token, publicKey);
    return payload;
  } catch (error) {
    throw new Error(`驗證 JWT 時發生錯誤: ${error.message}`);
  }
};

/**
 * 構建跳轉 URL
 * @param {string} targetUrl - 目標網站 URL
 * @param {string} token - JWT Token
 * @returns {string} 跳轉 URL
 */
export const buildRedirectUrl = (targetUrl, token) => {
  return `${targetUrl}#jwt=${token}`;
};

/**
 * 從跳轉 URL 中提取 JWT Token
 * @param {string} redirectUrl - 跳轉 URL
 * @returns {string|null} JWT Token 或 null
 */
export const extractJWTFromUrl = (redirectUrl) => {
  try {
    const url = new URL(redirectUrl);
    const hash = url.hash;
    const jwtMatch = hash.match(/#jwt=(.+)$/);
    return jwtMatch ? jwtMatch[1] : null;
  } catch (error) {
    return null;
  }
};
