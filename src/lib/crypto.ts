// 1) Funções criptográficas didáticas: Substituição simples + RLE + Inversão

function caesarShiftChar(ch: string, shift: number): string {
  const code = ch.charCodeAt(0);
  // a-z
  if (code >= 97 && code <= 122) {
    const base = 97;
    return String.fromCharCode(((code - base + shift + 26) % 26) + base);
  }
  // A-Z
  if (code >= 65 && code <= 90) {
    const base = 65;
    return String.fromCharCode(((code - base + shift + 26) % 26) + base);
  }
  // 0-9
  if (code >= 48 && code <= 57) {
    const base = 48;
    return String.fromCharCode(((code - base + shift + 10) % 10) + base);
  }
  // mantém outros caracteres (incluindo # e :) para RLE
  return ch;
}

function substitutionEncode(input: string): string {
  // desloca em +3
  return input.split("").map(c => caesarShiftChar(c, 3)).join("");
}

function substitutionDecode(input: string): string {
  // desloca em -3
  return input.split("").map(c => caesarShiftChar(c, -3)).join("");
}

// RLE com marcador '#count:char'. Literais '#' são escapados como '##'.
function rleEncode(input: string): string {
  if (input.length === 0) return "";
  let out = "";
  let runChar = input[0];
  let runLen = 1;
  const flush = () => {
    if (runLen >= 4) {
      out += `#${runLen}:${runChar}`;
    } else {
      for (let i = 0; i < runLen; i++) {
        out += (runChar === "#") ? "##" : runChar;
      }
    }
  };
  for (let i = 1; i < input.length; i++) {
    const ch = input[i];
    if (ch === runChar) {
      runLen++;
    } else {
      flush();
      runChar = ch;
      runLen = 1;
    }
  }
  flush();
  return out;
}

function rleDecode(input: string): string {
  let i = 0;
  let out = "";
  while (i < input.length) {
    const ch = input[i];
    if (ch === "#") {
      // Pode ser '##' (escape literal) ou '#count:char'
      if (i + 1 < input.length && input[i + 1] === "#") {
        out += "#";
        i += 2;
        continue;
      }
      // Ler count
      i += 1;
      let numStr = "";
      while (i < input.length && /[0-9]/.test(input[i])) {
        numStr += input[i++];
      }
      if (input[i] !== ":" || numStr.length === 0) {
        throw new Error("RLE inválido");
      }
      i += 1; // pular ':'
      if (i >= input.length) throw new Error("RLE inválido");
      const charToRepeat = input[i++];
      const count = parseInt(numStr, 10);
      out += charToRepeat.repeat(count);
    } else {
      out += ch;
      i += 1;
    }
  }
  return out;
}

export function encodeDidactic(plaintext: string): string {
  // 1) Substituição simples -> 2) RLE -> 3) Inversão
  const sub = substitutionEncode(plaintext);
  const rle = rleEncode(sub);
  return rle.split("").reverse().join("");
}

export function decodeDidactic(ciphertext: string): string {
  // Inverso: 1) Inversão -> 2) RLE decode -> 3) Substituição inversa
  const unrev = ciphertext.split("").reverse().join("");
  const unrle = rleDecode(unrev);
  return substitutionDecode(unrle);
}


