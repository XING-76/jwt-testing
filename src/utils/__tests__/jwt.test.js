import { describe, it, expect } from 'vitest';
import { generateJWT, verifyJWT, buildRedirectUrl, extractJWTFromUrl } from '../jwt.js';

describe('JWT 工具函數測試', () => {
  const testUserId = 'N100007965';
  const testSecretKey = 'A0PUZmC1hs82Bdbz5tlxuM7Yw46E9NV3'; // 預設密鑰
  const testTargetUrl = 'https://example.com';

  describe('generateJWT', () => {
    it('應該能夠生成有效的 JWT Token', async () => {
      const result = await generateJWT(testUserId, testSecretKey);

      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('isBase64');
      expect(result.isBase64).toBe(false);
      expect(typeof result.token).toBe('string');

      // 驗證 JWT 格式：header.payload.signature
      const jwtParts = result.token.split('.');
      expect(jwtParts).toHaveLength(3);
    });

    it('應該在空 userId 時拋出錯誤', async () => {
      await expect(generateJWT('', testSecretKey)).rejects.toThrow('使用者 ID 和密鑰不能為空');
    });

    it('應該在空 secretKey 時拋出錯誤', async () => {
      await expect(generateJWT(testUserId, '')).rejects.toThrow('使用者 ID 和密鑰不能為空');
    });

    it('應該生成包含正確 payload 的 JWT', async () => {
      const result = await generateJWT(testUserId, testSecretKey);

      // 解析 JWT payload
      const jwtParts = result.token.split('.');
      const payloadBase64 = jwtParts[1];

      // 補齊 base64 padding
      const paddedPayload = payloadBase64 + '='.repeat((4 - (payloadBase64.length % 4)) % 4);
      const payloadJson = atob(paddedPayload);
      const payload = JSON.parse(payloadJson);

      expect(payload).toHaveProperty('sub', testUserId);
      expect(payload).toHaveProperty('iat');
      expect(payload).toHaveProperty('nbf');
      expect(payload).toHaveProperty('exp');

      // 驗證時間邏輯
      const now = Math.floor(Date.now() / 1000);
      expect(payload.iat).toBeLessThanOrEqual(now);
      expect(payload.nbf).toBe(payload.iat - 5);
      expect(payload.exp).toBe(payload.iat + 180);
    });
  });

  describe('verifyJWT', () => {
    it('應該能夠驗證並解密正確的 JWT Token', async () => {
      const result = await generateJWT(testUserId, testSecretKey);
      const payload = await verifyJWT(result.token, testSecretKey);

      expect(payload).toHaveProperty('sub', testUserId);
      expect(payload).toHaveProperty('iat');
      expect(payload).toHaveProperty('nbf');
      expect(payload).toHaveProperty('exp');
    });

    it('應該在錯誤密鑰時拋出錯誤', async () => {
      const result = await generateJWT(testUserId, testSecretKey);
      const wrongSecretKey = 'wrong-secret-key';

      await expect(verifyJWT(result.token, wrongSecretKey)).rejects.toThrow('驗證 JWT 時發生錯誤');
    });

    it('應該在無效 Token 時拋出錯誤', async () => {
      const invalidToken = 'invalid.jwt.token';
      await expect(verifyJWT(invalidToken, testSecretKey)).rejects.toThrow('驗證 JWT 時發生錯誤');
    });

    it('應該在空密鑰時拋出錯誤', async () => {
      const result = await generateJWT(testUserId, testSecretKey);
      await expect(verifyJWT(result.token, '')).rejects.toThrow('驗證 JWT 時發生錯誤');
    });

    it('應該在空 Token 時拋出錯誤', async () => {
      await expect(verifyJWT('', testSecretKey)).rejects.toThrow('驗證 JWT 時發生錯誤');
    });
  });

  describe('buildRedirectUrl', () => {
    it('應該正確構建跳轉 URL', () => {
      const token = 'test.jwt.token';
      const redirectUrl = buildRedirectUrl(testTargetUrl, token);

      expect(redirectUrl).toBe(`${testTargetUrl}#jwt=${token}`);
    });

    it('應該處理不同的目標 URL', () => {
      const differentUrl = 'https://test.com/api';
      const token = 'test.jwt.token';
      const redirectUrl = buildRedirectUrl(differentUrl, token);

      expect(redirectUrl).toBe(`${differentUrl}#jwt=${token}`);
    });
  });

  describe('extractJWTFromUrl', () => {
    it('應該從跳轉 URL 中提取 JWT Token', () => {
      const token = 'test.jwt.token';
      const redirectUrl = `${testTargetUrl}#jwt=${token}`;
      const extractedToken = extractJWTFromUrl(redirectUrl);

      expect(extractedToken).toBe(token);
    });

    it('應該在沒有 JWT 時返回 null', () => {
      const urlWithoutJWT = 'https://example.com';
      const extractedToken = extractJWTFromUrl(urlWithoutJWT);

      expect(extractedToken).toBeNull();
    });

    it('應該在無效 URL 時返回 null', () => {
      const invalidUrl = 'invalid-url';
      const extractedToken = extractJWTFromUrl(invalidUrl);

      expect(extractedToken).toBeNull();
    });
  });

  describe('完整流程測試', () => {
    it('應該能夠完成完整的 JWT 生成、URL 構建、Token 提取和驗證流程', async () => {
      // 1. 生成 JWT Token
      const jwtResult = await generateJWT(testUserId, testSecretKey);
      expect(jwtResult.token).toBeDefined();
      expect(jwtResult.isBase64).toBe(false);

      // 2. 構建跳轉 URL
      const redirectUrl = buildRedirectUrl(testTargetUrl, jwtResult.token);
      expect(redirectUrl).toContain(jwtResult.token);

      // 3. 從 URL 中提取 JWT
      const extractedToken = extractJWTFromUrl(redirectUrl);
      expect(extractedToken).toBe(jwtResult.token);

      // 4. 驗證提取的 Token
      const payload = await verifyJWT(extractedToken, testSecretKey);
      expect(payload.sub).toBe(testUserId);
    });
  });

  describe('JWT 格式驗證測試', () => {
    it('應該驗證生成的 JWT Token 的基本格式', async () => {
      const result = await generateJWT(testUserId, testSecretKey);

      // JWT 格式：header.payload.signature
      const jwtParts = result.token.split('.');
      expect(jwtParts).toHaveLength(3);

      // 驗證每個部分都是 base64url 編碼
      jwtParts.forEach((part) => {
        expect(part).toMatch(/^[A-Za-z0-9-_]+$/);
      });
    });
  });

  describe('URL 處理測試', () => {
    it('應該正確處理包含 JWT 的 URL', () => {
      const urlWithJWT = 'https://example.com#jwt=eyJhbGciOiJIUzI1NiJ9.test.payload';
      const extractedToken = extractJWTFromUrl(urlWithJWT);

      expect(extractedToken).toBe('eyJhbGciOiJIUzI1NiJ9.test.payload');
    });

    it('應該處理 URL 中的其他參數', () => {
      const urlWithParams = 'https://example.com?param=value#jwt=test.token';
      const extractedToken = extractJWTFromUrl(urlWithParams);

      expect(extractedToken).toBe('test.token');
    });
  });
});
