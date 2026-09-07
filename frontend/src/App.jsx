import React, { useState, useRef } from 'react';
import './App.css';

export default function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleFileSelection = (file) => {
    if (!file) return;
    setSelectedFile(file);
    setError(null);

    const reader = new FileReader();
    reader.onload = (event) => setPreview(event.target?.result);
    reader.readAsDataURL(file);
  };

  const handleInputChange = (event) => {
    const file = event.target.files?.[0];
    handleFileSelection(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    handleFileSelection(file);
  };

  const handleVerify = async () => {
    if (!selectedFile) {
      setError('Please choose an image first.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch(`${API_URL}/api/verify`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok || !data.success && data.status !== 'success') {
        throw new Error(data.error || 'Verification failed.');
      }

      setResult(data);
    } catch (err) {
      setError(err.message || 'Something went wrong while verifying.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="container">
          <div className="brand">
            <span className="brand-mark">🔐</span>
            <div>
              <h1>Verify</h1>
              <p>Tamper-evident face verification on blockchain</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container page">
        {!result ? (
          <section className="upload-panel">
            <div className="dropzone" onClick={() => fileInputRef.current?.click()} onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleInputChange} hidden />

              {preview ? (
                <img src={preview} alt="Selected preview" className="preview" />
              ) : (
                <div className="upload-copy">
                  <div className="upload-icon">📸</div>
                  <h2>Upload your image</h2>
                  <p>Drag and drop or click to select</p>
                  <span>PNG, JPG, GIF, BMP up to 10MB</span>
                </div>
              )}
            </div>

            {error && <div className="error-box">⚠️ {error}</div>}

            <div className="actions">
              <button className="primary-btn" onClick={handleVerify} disabled={!selectedFile || loading}>
                {loading ? 'Verifying...' : 'Verify and Anchor'}
              </button>
            </div>
          </section>
        ) : (
          <section className="results-panel">
            <div className="result-header">
              <div className="success-badge">✓</div>
              <div>
                <h2>Verification Complete</h2>
                <p>Your face has been verified and anchored to blockchain.</p>
              </div>
            </div>

            <div className="card-grid">
              <div className="result-card">
                <h3>Face Detection</h3>
                <div className="meta-row"><span>Status</span><strong>{result.stages.face_detection.face_detected ? 'Detected' : 'Not detected'}</strong></div>
                <div className="meta-row"><span>Hash</span><code>{result.stages.face_detection.encoding_hash.slice(0, 32)}...</code></div>
                <div className="meta-row"><span>Face Count</span><strong>{result.stages.face_detection.face_count}</strong></div>
              </div>

              <div className="result-card">
                <h3>Verification Hash</h3>
                <code className="hash-box">{result.stages.verification.hash}</code>
              </div>

              <div className="result-card">
                <h3>Blockchain Record</h3>
                <div className="meta-row"><span>Network</span><strong>{result.stages.blockchain.network}</strong></div>
                <div className="meta-row"><span>Tx</span><code>{result.stages.blockchain.tx_hash.slice(0, 20)}...</code></div>
                <div className="meta-row"><span>Status</span><strong>{result.stages.blockchain.verification_status}</strong></div>
              </div>
            </div>

            <details className="json-panel">
              <summary>View Full JSON</summary>
              <pre>{JSON.stringify(result, null, 2)}</pre>
            </details>

            <div className="result-actions">
              <button className="secondary-btn" onClick={handleReset}>Verify Another</button>
              <button className="primary-btn" onClick={() => navigator.clipboard.writeText(JSON.stringify(result, null, 2))}>Copy JSON</button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
