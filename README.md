# AgriGov AI

> **Intelligent AI-powered administration platform for agriculture department offices.**

AgriGov AI automates agriculture office operations uing AI/ML — reducing manual work, delays, fraud, and inefficiency across document verification, fraud detection, field verification, grievance management, and scheme planning.

---

## Features

### 1. Intelligent Document Processing
- OCR-powered text extraction from farmer documents (PDF, images)
- AI verification of field completeness and correctness
- Outputs: Verified / Missing Fields / Needs Review

### 2. Fraud & Duplicate Detection
- ML anomaly detection using Isolation Forest
- Duplicate application detection via fuzzy matching
- Land overlap detection
- Real-time fraud scoring (0-100)

### 3. AI Field Verification
- Remote claim validation against regional crop data
- Cross-references crop type, land area, location, season
- Outputs: Valid / Mismatch with confidence score

### 4. Smart Grievance Classification
- NLP-based complaint categorization (Subsidy, Insurance, Crop Damage, Water, Technical)
- Priority prediction (Urgent, High, Medium, Low)
- 93%+ classification accuracy

### 5. Scheme Demand Prediction
- Linear regression forecasting for government schemes
- Regional and seasonal trend analysis
- Actionable planning recommendations

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS v4, Framer Motion, Recharts |
| Backend | FastAPI (Python) |
| Database | MongoDB (Motor async driver) |
| AI/ML | scikit-learn, pandas, numpy, EasyOCR, spaCy |

---

## Quick Start

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Opens at `http://localhost:5173`

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

API docs at `http://localhost:8000/docs`

---

## Project Structure

```
AgriGov-AI/
├── frontend/          # React + Vite app
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page-level views
│   │   ├── data/          # Mock data
│   │   └── index.css      # Global styles
│   └── ...
├── backend/           # FastAPI Python backend
│   ├── app/
│   │   ├── main.py        # App entry point
│   │   ├── routes/        # API endpoints
│   │   ├── services/      # AI/ML business logic
│   │   └── config.py      # Settings
│   └── requirements.txt
└── README.md
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/stats` | Dashboard statistics |
| POST | `/api/documents/verify` | Verify document text |
| POST | `/api/documents/upload` | Upload & process file |
| POST | `/api/fraud/scan` | Full fraud scan |
| POST | `/api/fraud/quick-score` | ML fraud score |
| POST | `/api/field/verify` | Verify field claim |
| POST | `/api/grievance/classify` | Classify complaint |
| POST | `/api/schemes/predict` | Predict scheme demand |
| GET | `/api/schemes/predict-all` | All schemes forecast |

---

## License

MIT
