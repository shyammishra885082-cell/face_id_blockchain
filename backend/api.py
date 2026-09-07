from pathlib import Path

from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.utils import secure_filename

from main import FaceIDBlockchainPipeline

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = Path(__file__).resolve().parent / "uploads"
UPLOAD_FOLDER.mkdir(exist_ok=True, parents=True)
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif", "bmp"}
MAX_FILE_SIZE = 10 * 1024 * 1024
app.config["UPLOAD_FOLDER"] = str(UPLOAD_FOLDER)
app.config["MAX_CONTENT_LENGTH"] = MAX_FILE_SIZE

pipeline = FaceIDBlockchainPipeline()


def allowed_file(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "healthy", "service": "face-id-blockchain", "version": "1.0.0"}), 200


@app.route("/api/info", methods=["GET"])
def info():
    return jsonify({
        "name": "Face ID + Blockchain Verification",
        "version": "1.0.0",
        "supported_formats": sorted(ALLOWED_EXTENSIONS),
        "max_file_size_mb": MAX_FILE_SIZE / (1024 * 1024),
        "blockchain": {"network": "Polygon Amoy Testnet"},
    }), 200


@app.route("/api/verify", methods=["POST"])
def verify_image():
    if "file" not in request.files:
        return jsonify({"success": False, "error": "No file provided in form-data under 'file'."}), 400

    uploaded_file = request.files["file"]
    if uploaded_file.filename == "":
        return jsonify({"success": False, "error": "No selected file."}), 400
    if not allowed_file(uploaded_file.filename):
        return jsonify({"success": False, "error": "Unsupported file type."}), 400

    filename = secure_filename(uploaded_file.filename)
    save_path = UPLOAD_FOLDER / filename
    uploaded_file.save(save_path)

    result = pipeline.process_pipeline(str(save_path))
    return jsonify(result), 200


@app.errorhandler(413)
def too_large(error):
    return jsonify({"success": False, "error": "File too large. Max 10MB."}), 413


if __name__ == "__main__":
    print("Starting Face ID API on http://localhost:5000")
    app.run(host="0.0.0.0", port=5000, debug=True)
