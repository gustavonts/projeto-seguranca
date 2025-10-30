// 2) Implementação simples de RSA com BigInt (chaves pequenas para demonstração)

function modPow(base: bigint, exp: bigint, mod: bigint): bigint {
  let result = 1n;
  let b = ((base % mod) + mod) % mod;
  let e = exp;
  while (e > 0n) {
    if (e & 1n) result = (result * b) % mod;
    b = (b * b) % mod;
    e >>= 1n;
  }
  return result;
}

function egcd(a: bigint, b: bigint): { g: bigint; x: bigint; y: bigint } {
  if (b === 0n) return { g: a, x: 1n, y: 0n };
  const { g, x, y } = egcd(b, a % b);
  return { g, x: y, y: x - (a / b) * y };
}

function modInv(a: bigint, m: bigint): bigint {
  const { g, x } = egcd(((a % m) + m) % m, m);
  if (g !== 1n) throw new Error("modInv inexistente");
  return ((x % m) + m) % m;
}

function isProbablePrime(n: bigint, k = 8): boolean {
  if (n < 2n) return false;
  for (const p of [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n]) {
    if (n === p) return true;
    if (n % p === 0n) return false;
  }
  let d = n - 1n;
  let s = 0n;
  while ((d & 1n) === 0n) {
    d >>= 1n;
    s++;
  }
  function check(a: bigint): boolean {
    let x = modPow(a, d, n);
    if (x === 1n || x === n - 1n) return true;
    for (let i = 1n; i < s; i++) {
      x = (x * x) % n;
      if (x === n - 1n) return true;
    }
    return false;
  }
  const bases = [2n, 325n, 9375n, 28178n, 450775n, 9780504n, 1795265022n];
  for (let i = 0; i < k && i < bases.length; i++) {
    const a = bases[i] % (n - 3n) + 2n;
    if (!check(a)) return false;
  }
  return true;
}

function randomBigInt(bits: number): bigint {
  const bytes = Math.ceil(bits / 8);
  const arr = new Uint8Array(bytes);
  if (typeof crypto !== "undefined" && (crypto as any).getRandomValues) {
    (crypto as any).getRandomValues(arr);
  } else {
    // Node.js
    const nodeCrypto = require("node:crypto");
    nodeCrypto.randomFillSync(arr);
  }
  let n = 0n;
  for (const b of arr) n = (n << 8n) | BigInt(b);
  const shift = BigInt(bytes * 8 - bits);
  n = n >> shift;
  // garantir bit alto e ímpar
  n |= 1n << BigInt(bits - 1);
  n |= 1n;
  return n;
}

export function generatePrime(bits: number): bigint {
  while (true) {
    const candidate = randomBigInt(bits);
    if (isProbablePrime(candidate)) return candidate;
  }
}

export type RsaKeyPair = {
  publicKey: { e: bigint; n: bigint };
  privateKey: { d: bigint; n: bigint; p: bigint; q: bigint };
};

export function generateRsaKeyPair(bits = 512): RsaKeyPair {
  const half = Math.floor(bits / 2);
  const p = generatePrime(half);
  const q = generatePrime(bits - half);
  const n = p * q;
  const phi = (p - 1n) * (q - 1n);
  const e = 65537n;
  if (phi % e === 0n) {
    // raro; regere chaves
    return generateRsaKeyPair(bits);
  }
  const d = modInv(e, phi);
  return {
    publicKey: { e, n },
    privateKey: { d, n, p, q },
  };
}

export function rsaEncrypt(m: bigint, pub: { e: bigint; n: bigint }): bigint {
  if (m >= pub.n) throw new Error("Mensagem maior que o módulo n");
  return modPow(m, pub.e, pub.n);
}

export function rsaDecrypt(c: bigint, priv: { d: bigint; n: bigint }): bigint {
  return modPow(c, priv.d, priv.n);
}

export function textToBigInt(text: string): bigint {
  const enc = new TextEncoder();
  const bytes = enc.encode(text);
  let n = 0n;
  for (const b of bytes) n = (n << 8n) | BigInt(b);
  return n;
}

export function bigIntToText(n: bigint): string {
  const bytes: number[] = [];
  let x = n;
  while (x > 0n) {
    bytes.unshift(Number(x & 0xffn));
    x >>= 8n;
  }
  return new TextDecoder().decode(new Uint8Array(bytes));
}


