from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)

model    = joblib.load("ml/model.pkl")
scaler   = joblib.load("ml/scaler.pkl")
features = joblib.load("ml/features.pkl")

class FinancialInput(BaseModel):
    profitability:    float
    liquidity:        float
    leverage:         float
    roa:              float
    operating_margin: float
    score:            int

@app.post("/predict")
def predict(data: FinancialInput):
    score = data.score

    # Use ML model for feature-based prediction
    feature_vector = [
        data.roa,                         # ROA(A)
        max(data.liquidity, 0.01),        # Current Ratio
        max(data.liquidity * 0.8, 0.01),  # Quick Ratio approx
        min(1 / (data.leverage + 0.1), 1),# Debt ratio
        min(1 / (data.leverage + 0.1), 1),# Net worth/Assets
        max(data.roa * 1.5, 0.01),        # Asset Turnover approx
        data.operating_margin,            # Operating Profit Rate
        data.profitability * 0.8,         # Cash flow rate approx
        data.profitability * 0.5,         # Retained Earnings approx
        data.roa,                         # Net Income/Assets
    ]

    try:
        scaled     = scaler.transform([feature_vector])
        ml_pred    = model.predict(scaled)[0]
        ml_proba   = model.predict_proba(scaled)[0]
        ml_bankrupt_prob = round(float(ml_proba[1]) * 100, 1)
    except Exception:
        ml_pred          = 0
        ml_bankrupt_prob = 10.0

    # Blend ML probability with score-based probability
    # Score is more reliable given our feature mapping limitations
    if score >= 75:
        score_bankrupt = max(2, 25 - score * 0.2)
        label          = "Healthy"
    elif score >= 50:
        score_bankrupt = 50 - score * 0.3
        label          = "Moderate"
    else:
        score_bankrupt = min(90, 80 - score * 0.3)
        label          = "At Risk"

    # Weighted blend: 40% ML, 60% score-based
    final_bankrupt = round(0.4 * ml_bankrupt_prob + 0.6 * score_bankrupt, 1)
    final_healthy  = round(100 - final_bankrupt, 1)
    confidence     = round(max(final_healthy, final_bankrupt), 1)

    return {
        "prediction":      0 if label == "Healthy" else 1,
        "label":           label,
        "confidence":      confidence,
        "bankruptcy_risk": final_bankrupt,
        "healthy_prob":    final_healthy,
    }

@app.get("/health")
def health():
    return {"status": "ok"}