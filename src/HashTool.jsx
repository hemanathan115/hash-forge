import { useState, useCallback } from "react";

const ALGORITHMS = ["MD5", "SHA-1", "SHA-256", "SHA-512"];

// MD5 implementation (pure JS, since WebCrypto doesn't support MD5)
function md5(input) {
  function safeAdd(x, y) { const lsw = (x & 0xffff) + (y & 0xffff); return (((x >> 16) + (y >> 16) + (lsw >> 16)) << 16) | (lsw & 0xffff); }
  function bitRotateLeft(num, cnt) { return (num << cnt) | (num >>> (32 - cnt)); }
  function md5cmn(q, a, b, x, s, t) { return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b); }
  function md5ff(a,b,c,d,x,s,t){return md5cmn((b&c)|((~b)&d),a,b,x,s,t);}
  function md5gg(a,b,c,d,x,s,t){return md5cmn((b&d)|(c&(~d)),a,b,x,s,t);}
  function md5hh(a,b,c,d,x,s,t){return md5cmn(b^c^d,a,b,x,s,t);}
  function md5ii(a,b,c,d,x,s,t){return md5cmn(c^(b|(~d)),a,b,x,s,t);}

  const str = unescape(encodeURIComponent(input));
  const bArr = [];
  for (let i = 0; i < str.length; i++) bArr.push(str.charCodeAt(i));
  bArr.push(128);
  while (bArr.length % 64 !== 56) bArr.push(0);
  const len = (str.length * 8);
  bArr.push(len & 0xff, (len >> 8) & 0xff, (len >> 16) & 0xff, (len >> 24) & 0xff, 0, 0, 0, 0);

  const words = [];
  for (let i = 0; i < bArr.length; i += 4)
    words.push((bArr[i]) | (bArr[i+1] << 8) | (bArr[i+2] << 16) | (bArr[i+3] << 24));

  let a = 1732584193, b = -271733879, c = -1732584194, d = 271733878;
  for (let i = 0; i < words.length; i += 16) {
    const [oa,ob,oc,od] = [a,b,c,d];
    a=md5ff(a,b,c,d,words[i+0],7,-680876936);d=md5ff(d,a,b,c,words[i+1],12,-389564586);c=md5ff(c,d,a,b,words[i+2],17,606105819);b=md5ff(b,c,d,a,words[i+3],22,-1044525330);
    a=md5ff(a,b,c,d,words[i+4],7,-176418897);d=md5ff(d,a,b,c,words[i+5],12,1200080426);c=md5ff(c,d,a,b,words[i+6],17,-1473231341);b=md5ff(b,c,d,a,words[i+7],22,-45705983);
    a=md5ff(a,b,c,d,words[i+8],7,1770035416);d=md5ff(d,a,b,c,words[i+9],12,-1958414417);c=md5ff(c,d,a,b,words[i+10],17,-42063);b=md5ff(b,c,d,a,words[i+11],22,-1990404162);
    a=md5ff(a,b,c,d,words[i+12],7,1804603682);d=md5ff(d,a,b,c,words[i+13],12,-40341101);c=md5ff(c,d,a,b,words[i+14],17,-1502002290);b=md5ff(b,c,d,a,words[i+15],22,1236535329);
    a=md5gg(a,b,c,d,words[i+1],5,-165796510);d=md5gg(d,a,b,c,words[i+6],9,-1069501632);c=md5gg(c,d,a,b,words[i+11],14,643717713);b=md5gg(b,c,d,a,words[i+0],20,-373897302);
    a=md5gg(a,b,c,d,words[i+5],5,-701558691);d=md5gg(d,a,b,c,words[i+10],9,38016083);c=md5gg(c,d,a,b,words[i+15],14,-660478335);b=md5gg(b,c,d,a,words[i+4],20,-405537848);
    a=md5gg(a,b,c,d,words[i+9],5,568446438);d=md5gg(d,a,b,c,words[i+14],9,-1019803690);c=md5gg(c,d,a,b,words[i+3],14,-187363961);b=md5gg(b,c,d,a,words[i+8],20,1163531501);
    a=md5gg(a,b,c,d,words[i+13],5,-1444681467);d=md5gg(d,a,b,c,words[i+2],9,-51403784);c=md5gg(c,d,a,b,words[i+7],14,1735328473);b=md5gg(b,c,d,a,words[i+12],20,-1926607734);
    a=md5hh(a,b,c,d,words[i+5],4,-378558);d=md5hh(d,a,b,c,words[i+8],11,-2022574463);c=md5hh(c,d,a,b,words[i+11],16,1839030562);b=md5hh(b,c,d,a,words[i+14],23,-35309556);
    a=md5hh(a,b,c,d,words[i+1],4,-1530992060);d=md5hh(d,a,b,c,words[i+4],11,1272893353);c=md5hh(c,d,a,b,words[i+7],16,-155497632);b=md5hh(b,c,d,a,words[i+10],23,-1094730640);
    a=md5hh(a,b,c,d,words[i+13],4,681279174);d=md5hh(d,a,b,c,words[i+0],11,-358537222);c=md5hh(c,d,a,b,words[i+3],16,-722521979);b=md5hh(b,c,d,a,words[i+6],23,76029189);
    a=md5hh(a,b,c,d,words[i+9],4,-640364487);d=md5hh(d,a,b,c,words[i+12],11,-421815835);c=md5hh(c,d,a,b,words[i+15],16,530742520);b=md5hh(b,c,d,a,words[i+2],23,-995338651);
    a=md5ii(a,b,c,d,words[i+0],6,-198630844);d=md5ii(d,a,b,c,words[i+7],10,1126891415);c=md5ii(c,d,a,b,words[i+14],15,-1416354905);b=md5ii(b,c,d,a,words[i+5],21,-57434055);
    a=md5ii(a,b,c,d,words[i+12],6,1700485571);d=md5ii(d,a,b,c,words[i+3],10,-1894986606);c=md5ii(c,d,a,b,words[i+10],15,-1051523);b=md5ii(b,c,d,a,words[i+1],21,-2054922799);
    a=md5ii(a,b,c,d,words[i+8],6,1873313359);d=md5ii(d,a,b,c,words[i+15],10,-30611744);c=md5ii(c,d,a,b,words[i+6],15,-1560198380);b=md5ii(b,c,d,a,words[i+13],21,1309151649);
    a=md5ii(a,b,c,d,words[i+4],6,-145523070);d=md5ii(d,a,b,c,words[i+11],10,-1120210379);c=md5ii(c,d,a,b,words[i+2],15,718787259);b=md5ii(b,c,d,a,words[i+9],21,-343485551);
    a=safeAdd(a,oa);b=safeAdd(b,ob);c=safeAdd(c,oc);d=safeAdd(d,od);
  }
  const result = [a,b,c,d];
  return result.map(n => {
    const hex = [];
    for (let j = 0; j < 4; j++) hex.push(('0' + ((n >>> (j*8)) & 0xff).toString(16)).slice(-2));
    return hex.join('');
  }).join('');
}

async function generateHash(text, algo) {
  if (algo === "MD5") return md5(text);
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest(algo, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

async function generateFileHash(file, algo) {
  const buffer = await file.arrayBuffer();
  if (algo === "MD5") {
    const text = new TextDecoder().decode(buffer);
    return md5(text);
  }
  const hashBuffer = await crypto.subtle.digest(algo, buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

export default function HashTool() {
  const [tab, setTab] = useState("generate");
  const [inputText, setInputText] = useState("");
  const [algo, setAlgo] = useState("SHA-256");
  const [hashes, setHashes] = useState({});
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState("");
  const [verifyHash, setVerifyHash] = useState("");
  const [verifyInput, setVerifyInput] = useState("");
  const [verifyAlgo, setVerifyAlgo] = useState("SHA-256");
  const [verifyResult, setVerifyResult] = useState(null);
  const [fileHash, setFileHash] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileAlgo, setFileAlgo] = useState("SHA-256");
  const [fileLoading, setFileLoading] = useState(false);
  const [compareHash, setCompareHash] = useState("");
  const [fileVerifyResult, setFileVerifyResult] = useState(null);

  const handleGenerate = useCallback(async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    const results = {};
    for (const a of ALGORITHMS) {
      results[a] = await generateHash(inputText, a);
    }
    setHashes(results);
    setLoading(false);
  }, [inputText]);

  const handleCopy = (hash, key) => {
    navigator.clipboard.writeText(hash);
    setCopied(key);
    setTimeout(() => setCopied(""), 1500);
  };

  const handleVerify = useCallback(async () => {
    if (!verifyInput.trim() || !verifyHash.trim()) return;
    const computed = await generateHash(verifyInput, verifyAlgo);
    setVerifyResult(computed.toLowerCase() === verifyHash.toLowerCase().trim());
  }, [verifyInput, verifyHash, verifyAlgo]);

  const handleFile = useCallback(async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    setFileLoading(true);
    setFileVerifyResult(null);
    const hash = await generateFileHash(file, fileAlgo);
    setFileHash(hash);
    setFileLoading(false);
  }, [fileAlgo]);

  const handleFileVerify = () => {
    if (!fileHash || !compareHash) return;
    setFileVerifyResult(fileHash.toLowerCase() === compareHash.toLowerCase().trim());
  };

  const algoColors = {
    "MD5": "#ff6b6b", "SHA-1": "#ffd93d", "SHA-256": "#6bcb77", "SHA-512": "#4d96ff"
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0f",
      fontFamily: "'Courier New', Courier, monospace",
      color: "#e0e0e0",
      padding: "0",
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #0d0d1a 0%, #111128 100%)",
        borderBottom: "1px solid #1e1e3a",
        padding: "32px 40px 0",
      }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: "linear-gradient(135deg, #4d96ff, #6bcb77)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20,
            }}>🔐</div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "0.05em", color: "#fff" }}>
                HASH FORGE
              </div>
              <div style={{ fontSize: 11, color: "#555", letterSpacing: "0.15em" }}>
                CRYPTOGRAPHIC HASH GENERATOR & VERIFIER
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 0, marginTop: 24 }}>
            {[
              { id: "generate", label: "⚡ Generate" },
              { id: "verify", label: "✓ Verify" },
              { id: "file", label: "📁 File Hash" },
            ].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                padding: "10px 24px",
                background: tab === t.id ? "#4d96ff" : "transparent",
                color: tab === t.id ? "#fff" : "#555",
                border: "none",
                borderBottom: tab === t.id ? "2px solid #4d96ff" : "2px solid transparent",
                cursor: "pointer",
                fontSize: 13,
                letterSpacing: "0.05em",
                fontFamily: "inherit",
                transition: "all 0.2s",
                borderRadius: "6px 6px 0 0",
              }}>{t.label}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 40px" }}>

        {/* GENERATE TAB */}
        {tab === "generate" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <textarea
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="Enter text to hash..."
              style={{
                width: "100%", minHeight: 130, background: "#111120",
                border: "1px solid #1e1e3a", borderRadius: 10,
                color: "#e0e0e0", fontFamily: "inherit", fontSize: 14,
                padding: "16px", resize: "vertical", outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.2s",
              }}
              onFocus={e => e.target.style.borderColor = "#4d96ff"}
              onBlur={e => e.target.style.borderColor = "#1e1e3a"}
            />
            <button onClick={handleGenerate} disabled={loading || !inputText.trim()} style={{
              alignSelf: "flex-start",
              background: "linear-gradient(135deg, #4d96ff, #6bcb77)",
              color: "#000", border: "none", borderRadius: 8,
              padding: "12px 32px", fontFamily: "inherit", fontWeight: 700,
              fontSize: 14, cursor: loading ? "not-allowed" : "pointer",
              letterSpacing: "0.08em", opacity: (!inputText.trim() || loading) ? 0.5 : 1,
              transition: "opacity 0.2s",
            }}>
              {loading ? "HASHING..." : "GENERATE ALL HASHES"}
            </button>

            {Object.keys(hashes).length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {ALGORITHMS.map(a => (
                  <div key={a} style={{
                    background: "#111120", border: "1px solid #1e1e3a",
                    borderLeft: `3px solid ${algoColors[a]}`, borderRadius: 8,
                    padding: "14px 18px",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <span style={{ fontSize: 11, color: algoColors[a], letterSpacing: "0.15em", fontWeight: 700 }}>{a}</span>
                      <button onClick={() => handleCopy(hashes[a], a)} style={{
                        background: copied === a ? "#6bcb77" : "#1e1e3a",
                        color: copied === a ? "#000" : "#aaa",
                        border: "none", borderRadius: 5, padding: "4px 12px",
                        cursor: "pointer", fontFamily: "inherit", fontSize: 11,
                        letterSpacing: "0.1em", transition: "all 0.2s",
                      }}>{copied === a ? "COPIED!" : "COPY"}</button>
                    </div>
                    <div style={{
                      fontFamily: "'Courier New', monospace", fontSize: 12,
                      color: "#8888aa", wordBreak: "break-all", lineHeight: 1.6,
                    }}>{hashes[a]}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VERIFY TAB */}
        {tab === "verify" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <textarea
              value={verifyInput}
              onChange={e => setVerifyInput(e.target.value)}
              placeholder="Enter original text..."
              style={{
                width: "100%", minHeight: 100, background: "#111120",
                border: "1px solid #1e1e3a", borderRadius: 10,
                color: "#e0e0e0", fontFamily: "inherit", fontSize: 14,
                padding: "16px", resize: "vertical", outline: "none",
                boxSizing: "border-box",
              }}
            />
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: "#555", marginBottom: 6, letterSpacing: "0.1em" }}>ALGORITHM</div>
                <select value={verifyAlgo} onChange={e => setVerifyAlgo(e.target.value)} style={{
                  width: "100%", background: "#111120", border: "1px solid #1e1e3a",
                  color: "#e0e0e0", borderRadius: 8, padding: "10px 14px",
                  fontFamily: "inherit", fontSize: 13, outline: "none",
                }}>
                  {ALGORITHMS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#555", marginBottom: 6, letterSpacing: "0.1em" }}>HASH TO VERIFY</div>
              <input
                value={verifyHash}
                onChange={e => setVerifyHash(e.target.value)}
                placeholder="Paste hash here..."
                style={{
                  width: "100%", background: "#111120", border: "1px solid #1e1e3a",
                  color: "#e0e0e0", borderRadius: 8, padding: "12px 16px",
                  fontFamily: "'Courier New', monospace", fontSize: 12, outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <button onClick={handleVerify} disabled={!verifyInput.trim() || !verifyHash.trim()} style={{
              alignSelf: "flex-start",
              background: "linear-gradient(135deg, #4d96ff, #6bcb77)",
              color: "#000", border: "none", borderRadius: 8,
              padding: "12px 32px", fontFamily: "inherit", fontWeight: 700,
              fontSize: 14, cursor: "pointer", letterSpacing: "0.08em",
              opacity: (!verifyInput.trim() || !verifyHash.trim()) ? 0.5 : 1,
            }}>VERIFY HASH</button>

            {verifyResult !== null && (
              <div style={{
                padding: "20px 24px",
                background: verifyResult ? "rgba(107,203,119,0.1)" : "rgba(255,107,107,0.1)",
                border: `1px solid ${verifyResult ? "#6bcb77" : "#ff6b6b"}`,
                borderRadius: 10, display: "flex", alignItems: "center", gap: 14,
              }}>
                <span style={{ fontSize: 28 }}>{verifyResult ? "✅" : "❌"}</span>
                <div>
                  <div style={{ fontWeight: 700, color: verifyResult ? "#6bcb77" : "#ff6b6b", fontSize: 15 }}>
                    {verifyResult ? "HASH VERIFIED — Integrity confirmed" : "HASH MISMATCH — Content may be altered"}
                  </div>
                  <div style={{ fontSize: 12, color: "#555", marginTop: 4 }}>
                    {verifyResult ? "The text matches the provided hash." : "The computed hash does not match the provided hash."}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* FILE HASH TAB */}
        {tab === "file" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ fontSize: 11, color: "#555", letterSpacing: "0.1em", marginBottom: 4 }}>ALGORITHM</div>
            <select value={fileAlgo} onChange={e => { setFileAlgo(e.target.value); setFileHash(""); setFileName(""); setFileVerifyResult(null); }} style={{
              background: "#111120", border: "1px solid #1e1e3a",
              color: "#e0e0e0", borderRadius: 8, padding: "10px 14px",
              fontFamily: "inherit", fontSize: 13, outline: "none", width: 200,
            }}>
              {ALGORITHMS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>

            <label style={{
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              gap: 10, border: "2px dashed #1e1e3a", borderRadius: 12,
              padding: "40px 24px", cursor: "pointer",
              background: "#0d0d1a", transition: "border-color 0.2s",
            }}
              onDragOver={e => e.preventDefault()}
              onDrop={async e => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                if (file) { setFileName(file.name); setFileLoading(true); const h = await generateFileHash(file, fileAlgo); setFileHash(h); setFileLoading(false); }
              }}
            >
              <input type="file" onChange={handleFile} style={{ display: "none" }} />
              <span style={{ fontSize: 36 }}>📁</span>
              <span style={{ color: "#555", fontSize: 14 }}>Drop file here or <span style={{ color: "#4d96ff" }}>browse</span></span>
              <span style={{ color: "#333", fontSize: 11 }}>Any file type supported</span>
            </label>

            {fileLoading && <div style={{ color: "#4d96ff", fontSize: 13 }}>Computing hash...</div>}

            {fileHash && (
              <div style={{
                background: "#111120", border: "1px solid #1e1e3a",
                borderLeft: `3px solid ${algoColors[fileAlgo]}`, borderRadius: 8, padding: "16px 18px",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 11, color: "#555" }}>{fileName} — {fileAlgo}</span>
                  <button onClick={() => handleCopy(fileHash, "file")} style={{
                    background: copied === "file" ? "#6bcb77" : "#1e1e3a",
                    color: copied === "file" ? "#000" : "#aaa",
                    border: "none", borderRadius: 5, padding: "4px 12px",
                    cursor: "pointer", fontFamily: "inherit", fontSize: 11,
                  }}>{copied === "file" ? "COPIED!" : "COPY"}</button>
                </div>
                <div style={{ fontFamily: "'Courier New', monospace", fontSize: 12, color: "#8888aa", wordBreak: "break-all" }}>
                  {fileHash}
                </div>
              </div>
            )}

            {fileHash && (
              <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: 11, color: "#555", letterSpacing: "0.1em", marginBottom: 8 }}>
                  COMPARE AGAINST KNOWN HASH (optional)
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <input
                    value={compareHash}
                    onChange={e => { setCompareHash(e.target.value); setFileVerifyResult(null); }}
 
