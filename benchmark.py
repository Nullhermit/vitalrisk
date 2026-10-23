"""Latency check: score every adult.csv profile (real age + sex; other health fields simulated, since adult.csv has none)."""
import sys, time, numpy as np, pandas as pd
from risk_engine import assess
df = pd.read_csv(sys.argv[1] if len(sys.argv) > 1 else "adult.csv"); n = len(df)
rng = np.random.default_rng(7)
w = rng.normal(75, 14, n).clip(40, 150); h = rng.normal(168, 9, n).clip(140, 200)
s = rng.normal(124, 16, n).clip(90, 200); g = rng.normal(98, 18, n).clip(65, 300)
t0 = time.perf_counter()
for i in range(n):
    assess(dict(age=int(df.age[i]), sex="M" if df.gender[i] == "Male" else "F", weight=w[i], height=h[i], sbp=s[i], dbp=80,
                glucose=g[i], smoker=bool(rng.random() < .2), activity=int(rng.integers(0, 300)), family="none"))
dt = time.perf_counter() - t0
print(f"Scored {n:,} assessments in {dt:.2f} s  ({dt / n * 1000:.3f} ms each)  - target: under 2 s per request")
