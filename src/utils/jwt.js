import * as jose from 'jose';

/**
 * 生成 JWT Token
 * @param {string} userId - 使用者 ID
 * @param {string} secretKey - JWT 密鑰
 * @param {number} expirationHours - 過期時間（小時），預設 1 小時
 * @returns {Promise<string>} JWT Token
 */
export const generateJWT = async (userId, secretKey, expirationHours = 1) => {
  try {
    if (!userId || !secretKey) {
      throw new Error('使用者 ID 和密鑰不能為空');
    }

    const payload = {
      uid: userId,
    };

    const secret = new TextEncoder().encode(secretKey);
    const token = await new jose.SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(`${expirationHours}h`)
      .sign(secret);

    return token;
  } catch (error) {
    throw new Error(`生成 JWT 時發生錯誤: ${error.message}`);
  }
};

/**
 * 驗證並解密 JWT Token
 * @param {string} token - JWT Token
 * @param {string} secretKey - JWT 密鑰
 * @returns {Promise<Object>} 解密的 payload
 */
export const verifyJWT = async (token, secretKey) => {
  try {
    if (!token || !secretKey) {
      throw new Error('Token 和密鑰不能為空');
    }

    const secret = new TextEncoder().encode(secretKey);
    const { payload } = await jose.jwtVerify(token, secret);
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
