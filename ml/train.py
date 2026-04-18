import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, accuracy_score
import joblib
import os

# ── Load data ─────────────────────────────────────────────────
df = pd.read_csv("ml/data.csv")

# Strip leading/trailing spaces from ALL column names
df.columns = df.columns.str.strip()

print(f"Dataset shape: {df.shape}")
print(f"Bankruptcy distribution:\n{df['Bankrupt?'].value_counts()}")

# ── Features ──────────────────────────────────────────────────
features = [
    "ROA(A) before interest and % after tax",
    "Current Ratio",
    "Quick Ratio",
    "Debt ratio %",
    "Net worth/Assets",
    "Total Asset Turnover",
    "Operating Profit Rate",
    "Cash flow rate",
    "Retained Earnings to Total Assets",
    "Net Income to Total Assets",
]

target = "Bankrupt?"

# ── Clean ─────────────────────────────────────────────────────
df = df[features + [target]].copy()
df = df.replace([np.inf, -np.inf], np.nan)
df = df.dropna()

print(f"\nClean dataset shape: {df.shape}")

X = df[features]
y = df[target]

# ── Split ─────────────────────────────────────────────────────
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# ── Scale ─────────────────────────────────────────────────────
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled  = scaler.transform(X_test)

# ── Train ─────────────────────────────────────────────────────
model = RandomForestClassifier(
    n_estimators=200,
    max_depth=10,
    class_weight="balanced",
    random_state=42,
    n_jobs=-1
)

model.fit(X_train_scaled, y_train)

# ── Evaluate ──────────────────────────────────────────────────
y_pred = model.predict(X_test_scaled)
acc    = accuracy_score(y_test, y_pred)

print(f"\nAccuracy: {acc * 100:.2f}%")
print("\nClassification Report:")
print(classification_report(y_test, y_pred,
      target_names=["Healthy", "Bankrupt"]))

# ── Feature importance ────────────────────────────────────────
importance = pd.DataFrame({
    "feature":    features,
    "importance": model.feature_importances_
}).sort_values("importance", ascending=False)

print("\nTop 5 most important features:")
print(importance.head())

# ── Save ──────────────────────────────────────────────────────
os.makedirs("ml", exist_ok=True)
joblib.dump(model,    "ml/model.pkl")
joblib.dump(scaler,   "ml/scaler.pkl")
joblib.dump(features, "ml/features.pkl")

print("\nModel saved to ml/model.pkl")
print("Scaler saved to ml/scaler.pkl")