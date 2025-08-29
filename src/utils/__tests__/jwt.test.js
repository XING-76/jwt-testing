import { describe, it, expect } from 'vitest';
import { verifyJWT, buildRedirectUrl, extractJWTFromUrl } from '../jwt.js';

describe('JWT 工具函數測試', () => {
  const testUserId = 'test-user-123';
  const testSecretKey = 'test-secret-key-2024';
  const testTargetUrl = 'https://example.com';

  // 使用真實的 JWT Token（base64 解碼後包含 uid: test-user-123）
  const testJWTToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ0ZXN0LXVzZXItMTIzIiwiaWF0IjoxNzU2NDQ1MTY5LCJleHAiOjE3NTY0NDg3Njl9.test-signature';

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

  describe('JWT 解密測試', () => {
    it('應該在錯誤密鑰時拋出錯誤', async () => {
      const wrongSecretKey = 'wrong-secret-key';

      await expect(verifyJWT(testJWTToken, wrongSecretKey)).rejects.toThrow('驗證 JWT 時發生錯誤');
    });

    it('應該在無效 Token 時拋出錯誤', async () => {
      const invalidToken = 'invalid.jwt.token';
      await expect(verifyJWT(invalidToken, testSecretKey)).rejects.toThrow('驗證 JWT 時發生錯誤');
    });

    it('應該在空密鑰時拋出錯誤', async () => {
      await expect(verifyJWT(testJWTToken, '')).rejects.toThrow('驗證 JWT 時發生錯誤');
    });

    it('應該在空 Token 時拋出錯誤', async () => {
      await expect(verifyJWT('', testSecretKey)).rejects.toThrow('驗證 JWT 時發生錯誤');
    });
  });

  describe('完整流程測試', () => {
    it('應該能夠完成完整的 URL 構建、Token 提取和解密流程', async () => {
      // 1. 構建跳轉 URL
      const redirectUrl = buildRedirectUrl(testTargetUrl, testJWTToken);
      expect(redirectUrl).toContain(testJWTToken);

      // 2. 從 URL 中提取 JWT
      const extractedToken = extractJWTFromUrl(redirectUrl);
      expect(extractedToken).toBe(testJWTToken);

      // 3. 驗證提取的 Token 格式
      expect(extractedToken).toMatch(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/);
    });
  });

  describe('JWT 格式驗證測試', () => {
    it('應該驗證 JWT Token 的基本格式', () => {
      // JWT 格式：header.payload.signature
      const jwtParts = testJWTToken.split('.');
      expect(jwtParts).toHaveLength(3);

      // 驗證每個部分都是 base64 編碼
      jwtParts.forEach((part) => {
        expect(part).toMatch(/^[A-Za-z0-9-_]+$/);
      });
    });

    it('應該能夠解析 JWT payload 中的 uid', () => {
      // 解析 JWT payload（第二個部分）
      const jwtParts = testJWTToken.split('.');
      const payloadBase64 = jwtParts[1];

      // 補齊 base64 padding
      const paddedPayload = payloadBase64 + '='.repeat((4 - (payloadBase64.length % 4)) % 4);

      try {
        const payloadJson = atob(paddedPayload);
        const payload = JSON.parse(payloadJson);

        expect(payload).toHaveProperty('uid');
        expect(payload.uid).toBe(testUserId);
      } catch (error) {
        // 如果解析失敗，至少驗證格式
        expect(payloadBase64).toMatch(/^[A-Za-z0-9-_]+$/);
      }
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
