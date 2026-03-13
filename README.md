# 🔐 Hash Forge — Cryptographic Hash Generator & Verifier

A modern, browser-based cryptographic hashing tool built with **React** and the **Web Crypto API**.

---

## ✨ Features

- **Generate Hashes** — Hash any text with MD5, SHA-1, SHA-256, or SHA-512 simultaneously
- **Verify Integrity** — Check if a piece of text matches a known hash
- **File Hashing** — Drag & drop any file to compute its hash
- **File Comparison** — Compare a file's hash against an expected value
- **Copy to Clipboard** — One-click copy for any hash output

---

## 🔑 Supported Algorithms

| Algorithm | Bits  | Use Case                    |
|-----------|-------|-----------------------------|
| MD5       | 128   | Legacy/checksums (not secure)|
| SHA-1     | 160   | Deprecated, avoid for secrets|
| SHA-256   | 256   | ✅ Recommended general use   |
| SHA-512   | 512   | High-security applications  |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone or extract the project
cd hash-tool

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

The output will be in the `dist/` folder, ready to deploy to any static host.

---

## 🧠 How It Works

### Text Hashing
Uses the browser's built-in [`crypto.subtle.digest()`](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest) API for SHA algorithms. MD5 is implemented in pure JavaScript since WebCrypto doesn't support it natively.

### File Hashing
Reads the file as an `ArrayBuffer` using the File API, then passes it to the same hashing functions.

### Verification
Computes the hash of the given input and compares it (case-insensitive) against the provided hash string.

---

## 📁 Project Structure

```
hash-tool/
├── src/
│   ├── HashTool.jsx      # Main component
│   └── main.jsx          # React entry point
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## 🛡️ Security Notes

- **All hashing is done client-side** — no data is sent to any server.
- MD5 and SHA-1 are considered **cryptographically broken** and should not be used for security-sensitive applications.
- **SHA-256** is the recommended choice for general integrity verification.

---

## 📜 License

MIT License — free to use, modify, and distribute.

---

*Built for hemanathan115 | Hash Forge v1.0*
