# 🔐 Verify: Face ID + Blockchain Verification

A complete end-to-end pipeline that detects faces from images, creates tamper-evident verification hashes, and anchors them to blockchain for immutable records. Perfect for identity verification, security compliance, and audit trails.

**Live Demo:** [Coming Soon]  
**GitHub:** [github.com/shyammishra885082-cell/verify](https://github.com/shyammishra885082-cell)

---

## 🎯 What It Does

1. **Face Detection** — Detects and encodes faces using advanced face recognition
2. **Verification Hashing** — Creates SHA-256 tamper-evident hashes combining:
   - Face encoding data
   - Image hash
   - Timestamp
3. **Blockchain Anchoring** — Records verification on Polygon Amoy Testnet
4. **Immutable Records** — Once anchored, records cannot be modified

### Key Features

- ✅ **Privacy First** — Face encodings are hashed, no personal data stored
- ✅ **Tamper-Evident** — Blockchain verification prevents data tampering
- ✅ **Zero Servers** — The pipeline itself is what gets deployed
- ✅ **Fully Open Source** — See exactly what runs, no black boxes
- ✅ **Production Ready** — Tested with real images and blockchain testnet

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Interface (React)                  │
│  Drag-drop image upload, real-time verification, results view   │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│                      Backend API (Flask)                        │
│  /api/verify - POST (multipart/form-data with image file)      │
│  /api/batch-verify - POST (multiple files)                     │
│  /api/info - GET (pipeline capabilities)                       │
│  /api/health - GET (service status)                            │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│                   Pipeline Core (Python)                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Stage 1: Face Detection & Encoding                      │  │
│  │ - Load image with OpenCV                               │  │
│  │ - Detect faces using dlib                              │  │
│  │ - Create 128-D face encoding vector                    │  │
│  │ - Hash encoding to SHA-256                             │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           │                                     │
│                           ↓                                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Stage 2: Verification Hash Creation                     │  │
│  │ - Combine face encoding hash + image hash + timestamp   │  │
│  │ - Create SHA-256 verification hash                      │  │
│  │ - Result: Tamper-evident record                         │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           │                                     │
│                           ↓                                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Stage 3: Blockchain Anchoring                           │  │
│  │ - Anchor verification hash to Polygon Amoy              │  │
│  │ - Create immutable on-chain record                      │  │
│  │ - Return transaction hash for verification              │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│              Polygon Amoy Testnet (Blockchain)                  │
│  Immutable record of verification data anchored on-chain        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📋 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+
- pip and npm
- Git

### Installation (5 minutes)

#### 1. Clone the Repository

```bash
git clone https://github.com/shyammishra885082-cell/verify.git
cd verify
```

#### 2. Setup Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

#### 3. Setup Frontend

```bash
cd ../frontend

# Install dependencies
npm install
```

#### 4. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate
python api.py
# Server running at http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# UI available at http://localhost:3000
```

Open http://localhost:3000 in your browser!

---

## 🎮 Usage

### Via Web Interface (Recommended)

1. Open http://localhost:3000
2. Upload an image (drag-drop or click)
3. Click **"Verify and Anchor"**
4. View results with blockchain transaction hash
5. Copy JSON for integration or compliance records

### Via API (cURL)

```bash
# Verify a single image
curl -X POST -F "file=@photo.jpg" http://localhost:5000/api/verify

# Response:
{
  "status": "success",
  "timestamp": "2025-01-20T10:30:00Z",
  "stages": {
    "face_detection": {
      "success": true,
      "face_detected": true,
      "encoding_hash": "a1b2c3d4...",
      "face_count": 1
    },
    "verification": {
      "hash": "e5f6g7h8...",
      "algorithm": "SHA-256"
    },
    "blockchain": {
      "tx_hash": "0x123abc...",
      "network": "Polygon Amoy Testnet",
      "status": "anchored"
    }
  }
}
```

### Via Python SDK

```python
from backend.main import FaceIDBlockchainPipeline

pipeline = FaceIDBlockchainPipeline()
result = pipeline.process_pipeline('path/to/image.jpg')

print(f"Verification Hash: {result['stages']['verification']['hash']}")
print(f"Blockchain TX: {result['stages']['blockchain']['tx_hash']}")
```

---

## 🔬 Technical Details

### Face Detection & Encoding

Uses **face_recognition** library built on **dlib**:
- State-of-the-art CNN-based detection
- Creates 128-dimensional encoding vectors
- Encodes facial features, not identity
- Each face gets unique, deterministic encoding

```python
image = face_recognition.load_image_file("photo.jpg")
face_encodings = face_recognition.face_encodings(image)
# Result: 128-D numpy array per detected face
```

### Verification Hash Algorithm

```
verification_hash = SHA256({
  "face_encoding_hash": SHA256(face_128d_vector),
  "image_hash": SHA256(image_file_bytes),
  "timestamp": ISO8601_timestamp
})
```

This creates a **tamper-evident** record where:
- Changing any image pixel changes the hash
- Changing the timestamp changes the hash
- Hash is then immutably recorded on-chain

### Blockchain Integration

**Network:** Polygon Amoy Testnet  
**Contract:** Simple data anchoring (hash storage)  
**Cost:** ~0.001 MATIC per transaction (~$0.00001 USD)

**Smart Contract Interface:**

```solidity
function anchorData(bytes32 dataHash, string memory metadata) 
  public returns (bool)
```

---

## 📊 Performance & Limitations

### Performance

| Operation | Time | Notes |
|-----------|------|-------|
| Face Detection | 50-200ms | Depends on image size |
| Hash Creation | 10ms | CPU-bound |
| Blockchain Anchor | 2-5s | Testnet confirmation |
| **Total E2E** | **~3-5 seconds** | For single image |

### Limitations

- **One face per image** — Currently anchors first detected face
- **Image size** — Optimal for 640x480 to 2048x2048 px
- **Testnet only** — Currently uses Polygon Amoy (free)
- **No hardcoding** — No reverse search results built-in
- **Consent-based** — By design, only uses images you upload

### Deliberate Design Choices

This pipeline **intentionally does NOT**:

- ❌ Store face encodings (only hashes)
- ❌ Use reverse-image search to find people
- ❌ Create searchable face databases
- ❌ Link faces to identities without consent
- ❌ Store data on centralized servers

We optimize for **privacy** and **consent**, not surveillance capability.

---

## 🔐 Security & Privacy

### Data Flow

```
Your Computer → Uploaded Image → Face Detection
                                  ↓
                        Extract 128-D Encoding
                                  ↓
                        Hash Encoding (lose original)
                                  ↓
                        Create Verification Hash
                                  ↓
                        Anchor to Blockchain
                                  ↓
                        Your Verification Record
```

### What Gets Stored

- ✅ **Verification Hash** (SHA-256, immutable on-chain)
- ✅ **Face Encoding Hash** (cannot be reversed to face)
- ✅ **Timestamp**
- ✅ **Image Hash** (for tamper detection)

### What Does NOT Get Stored

- ❌ Original image files
- ❌ Face encoding vectors (only hashed)
- ❌ Personal information
- ❌ Identity links
- ❌ Metadata (EXIF data) stripped

### Compliance

- ✅ GDPR compliant (no personal data stored)
- ✅ No persistent biometric storage
- ✅ Consent-based (you control images)
- ✅ Immutable audit trail (blockchain)

---

## 🚀 Deployment

### Docker (Production)

```bash
# Build images
docker-compose build

# Run services
docker-compose up -d

# Check status
docker-compose ps
```

**docker-compose.yml:**

```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - FLASK_ENV=production
    volumes:
      - ./backend/uploads:/app/uploads

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
```

### Cloud Deployment

**Railway.app** (Recommended):
```bash
# Connect GitHub repo, Railway auto-deploys
# Set environment variables in Railway dashboard
# Deploy frontend to Vercel separately
```

**Heroku:**
```bash
heroku create verify-prod
git push heroku main
heroku open
```

---

## 📈 Real-World Use Cases

### 1. **Identity Verification Compliance**
```
User submits face → Verify & anchor → Compliance record
Medical/Banking: Prove consent, create audit trail
```

### 2. **Secure Document Signing**
```
Signature verification → Create face hash → Anchor with timestamp
Legal: Prove who signed and when
```

### 3. **Employee Onboarding**
```
New hire photo → Verify identity → Anchor to HR record
HR: Immutable onboarding trail
```

### 4. **Access Control Audit Trail**
```
Building entry → Log face verification → Blockchain record
Security: Immutable entry/exit logs
```

---

## 🛠️ Development

### Project Structure

```
verify/
├── backend/
│   ├── main.py              # Core pipeline
│   ├── api.py               # Flask API
│   ├── requirements.txt      # Python deps
│   └── uploads/             # Uploaded images
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # React component
│   │   ├── App.css          # Styling
│   │   └── main.jsx         # Entry point
│   ├── index.html           # HTML shell
│   ├── vite.config.js       # Build config
│   └── package.json         # Node deps
├── docker-compose.yml       # Container setup
└── README.md                # This file
```

### Running Tests

```bash
# Backend unit tests
cd backend
python -m pytest tests/

# Test single pipeline
python main.py ./sample_image.jpg
```

### Building for Production

```bash
# Frontend
cd frontend
npm run build
# Output: dist/ folder ready for deployment

# Backend
cd backend
python -m pip install gunicorn
gunicorn -w 4 api:app
```

---

## 📚 API Reference

### POST /api/verify

Upload and verify a single image.

**Request:**
```
Content-Type: multipart/form-data
file: <image file>
```

**Response (200 OK):**
```json
{
  "status": "success",
  "timestamp": "2025-01-20T10:30:00Z",
  "stages": {
    "face_detection": {
      "success": true,
      "face_detected": true,
      "face_count": 1,
      "encoding_hash": "a1b2c3d4...",
      "face_location": { "top": 100, "right": 200, "bottom": 300, "left": 150 }
    },
    "verification": {
      "hash": "verification_hash_here",
      "algorithm": "SHA-256"
    },
    "blockchain": {
      "tx_hash": "0x123...",
      "network": "Polygon Amoy Testnet",
      "verification_status": "anchored"
    }
  }
}
```

### POST /api/batch-verify

Verify multiple images in one request.

**Request:**
```
Content-Type: multipart/form-data
files: <multiple image files>
```

**Response:** Array of verification results

### GET /api/info

Get pipeline capabilities and info.

```bash
curl http://localhost:5000/api/info
```

### GET /api/health

Health check endpoint.

```bash
curl http://localhost:5000/api/health
```

---

## 🤝 Contributing

Contributions welcome! Areas where we need help:

- [ ] Mainnet deployment (Polygon)
- [ ] Additional blockchain networks (Ethereum, Solana)
- [ ] Batch processing optimization
- [ ] Advanced facial matching (multiple face handling)
- [ ] Compliance integrations (KYC/AML)
- [ ] Mobile app (React Native)

**Steps:**
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📝 License

MIT License - see LICENSE file for details

---

## ❓ FAQ

**Q: Where does the image get stored?**  
A: Images are temporarily stored in `backend/uploads/` and can be deleted after verification. No permanent storage by default.

**Q: Can I recover the original face encoding?**  
A: No. We only store the hash of the encoding, which is one-way. The encoding itself is never stored.

**Q: Is this production-ready?**  
A: Yes for testnets. For mainnet, add wallet management, upgrade to smart contract, and add proper error handling.

**Q: How much does blockchain anchoring cost?**  
A: On Polygon Amoy Testnet: Free (testnet). On Polygon Mainnet: ~$0.001 USD per transaction.

**Q: Can I use this for facial recognition/searching?**  
A: By design, this pipeline does NOT support facial recognition or searching. It's for identity verification of consenting users only.

---

## 📞 Support

- **Issues:** GitHub Issues
- **Email:** [GitHub Profile]
- **Twitter:** @shyammishra

---

## 🙏 Acknowledgments

- **face_recognition** library (Adam Geitgey)
- **dlib** (Davis King)
- **web3.py** (Ethereum Foundation)
- **React & Vite** communities

---

**Last Updated:** January 2025  
**Version:** 1.0.0  
**Status:** Production Ready (Testnet)


https://github.com/user-attachments/assets/9990cb0a-fa91-461b-b983-17ebf33599f1

