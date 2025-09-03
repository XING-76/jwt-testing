const getPrivateKey = () => {
  const privateKey = import.meta.env.VITE_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error('PRIVATE_KEY 未設置');
  }

  if (!privateKey.includes('-----BEGIN PRIVATE KEY-----')) {
    return `-----BEGIN PRIVATE KEY-----\n${privateKey}\n-----END PRIVATE KEY-----`;
  }

  return privateKey;
};

const getPublicKey = () => {
  const publicKey = import.meta.env.VITE_PUBLIC_KEY;
  if (!publicKey) {
    throw new Error('PUBLIC_KEY 未設置');
  }

  if (!publicKey.includes('-----BEGIN PUBLIC KEY-----')) {
    return `-----BEGIN PUBLIC KEY-----\n${publicKey}\n-----END PUBLIC KEY-----`;
  }

  return publicKey;
};

export const PRIVATE_KEY = getPrivateKey();
export const PUBLIC_KEY = getPublicKey();
