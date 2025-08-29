import * as jose from 'jose';

/**
 * 生成 JWT Token
 * @param {string} userId - 使用者 ID
 * @param {string} secretKey - JWT 密鑰
 * @param {number} expirationSeconds - 創建時間後180秒
 * @returns {Promise<string>} JWT Token
 */
export const generateJWT = async (userId, secretKey, expirationSeconds = 180) => {
  try {
    if (!userId || !secretKey) {
      throw new Error('使用者 ID 和密鑰不能為空');
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

    // 處理用戶輸入的密鑰，確保與 jwt.io 兼容
    let secret;
    let isBase64 = false;

    // 檢查是否為有效的 base64url 格式
    const base64Regex = /^[A-Za-z0-9_-]+$/;
    const isValidBase64 =
      base64Regex.test(secretKey) && secretKey.length % 4 === 0 && secretKey.length >= 4;

    if (isValidBase64) {
      try {
        // 嘗試將密鑰作為 base64url 解碼
        const decoded = jose.base64url.decode(secretKey);
        // 檢查解碼後的內容是否合理
        if (decoded.length > 0) {
          secret = decoded;
          isBase64 = true;
        } else {
          throw new Error('Empty decoded content');
        }
      } catch (error) {
        // 解碼失敗，使用 UTF-8 編碼
        const encoder = new TextEncoder();
        secret = encoder.encode(secretKey);
      }
    } else {
      // 不是 base64url 格式，使用 UTF-8 編碼
      const encoder = new TextEncoder();
      secret = encoder.encode(secretKey);
    }

    const token = await new jose.SignJWT(payload)
      .setProtectedHeader({
        alg: 'HS256',
        typ: 'JWT',
      })
      .setIssuedAt(now)
      .setNotBefore(nbf)
      .setExpirationTime(exp)
      .sign(secret);

    return { token, isBase64 };
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

    // 使用與生成時相同的密鑰處理邏輯
    let secret;

    // 檢查是否為有效的 base64url 格式
    const base64Regex = /^[A-Za-z0-9_-]+$/;
    const isValidBase64 =
      base64Regex.test(secretKey) && secretKey.length % 4 === 0 && secretKey.length >= 4;

    if (isValidBase64) {
      try {
        // 嘗試將密鑰作為 base64url 解碼
        const decoded = jose.base64url.decode(secretKey);
        // 檢查解碼後的內容是否合理
        if (decoded.length > 0) {
          secret = decoded;
        } else {
          throw new Error('Empty decoded content');
        }
      } catch (error) {
        // 解碼失敗，使用 UTF-8 編碼
        const encoder = new TextEncoder();
        secret = encoder.encode(secretKey);
      }
    } else {
      // 不是 base64url 格式，使用 UTF-8 編碼
      const encoder = new TextEncoder();
      secret = encoder.encode(secretKey);
    }

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
