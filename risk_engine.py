"""VitalRisk - Chronic Disease Risk Engine
CVD: Framingham 10-yr general CVD risk, non-laboratory (BMI) model - D'Agostino et al., Circulation 2008;117:743-53
Diabetes: rule-based points adapted from FINDRISC (Lindstrom & Tuomilehto, Diabetes Care 2003) + ADA fasting-glucose bands.
Educational screening aid only - not a diagnosis."""
import math

FRS = {  # coefficients, group mean, 10-yr baseline survival
    "M": dict(age=3.11296, bmi=0.79277, sbp=1.85508, sbp_t=1.92672, smk=0.70953, dm=0.53160, mean=23.9388, s0=0.88431),
    "F": dict(age=2.72107, bmi=0.51125, sbp=2.81291, sbp_t=2.88267, smk=0.61868, dm=0.77763, mean=26.0145, s0=0.94833),
}

def bmi_of(weight_kg, height_cm):
    return weight_kg / (height_cm / 100) ** 2

def cvd_risk(age, sex, bmi, sbp, bp_treated=False, smoker=False, diabetes=False):
    c = FRS[sex]
    s = (c["age"] * math.log(age) + c["bmi"] * math.log(bmi)
         + (c["sbp_t"] if bp_treated else c["sbp"]) * math.log(sbp)
         + c["smk"] * smoker + c["dm"] * diabetes)
    return 1 - c["s0"] ** math.exp(s - c["mean"])          # 10-year probability 0..1

def cvd_category(r):
    return "Low" if r < 0.10 else "Moderate" if r < 0.20 else "High"

def diabetes_score(age, bmi, sbp, dbp, bp_treated, fam, active_min_week, fasting_glucose):
    pts, parts = 0, []
    a = 0 if age < 45 else 2 if age < 55 else 3 if age < 65 else 4
    b = 0 if bmi < 25 else 1 if bmi < 30 else 3
    h = 2 if (bp_treated or sbp >= 135 or dbp >= 85) else 0
    f = {"none": 0, "extended": 3, "parent_sibling": 5}[fam]
    p = 2 if active_min_week < 150 else 0
    g = 0 if fasting_glucose < 100 else 5
    pts = a + b + h + f + p + g
    parts = dict(age=a, bmi=b, bp=h, family=f, inactivity=p, glucose=g)
    cat = "Low" if pts < 7 else "Moderate" if pts < 15 else "High"
    if fasting_glucose >= 126:
        cat = "High"                                          # ADA diagnostic-range override
    return pts, cat, parts

def confidence(age, measured_bp, measured_glucose, bmi):
    """Input-quality label (NOT a statistical CI)."""
    notes, lvl = [], 2
    if not 30 <= age <= 74:
        lvl -= 1; notes.append("Age outside the 30-74 range the Framingham model was validated on")
    if not measured_bp: lvl -= 1; notes.append("Blood pressure was estimated, not measured")
    if not measured_glucose: lvl -= 1; notes.append("Glucose was not supplied")
    if not 15 <= bmi <= 50: lvl -= 1; notes.append("BMI outside typical range")
    return ["Low", "Medium", "High"][max(lvl, 0)], notes

def assess(p):
    bmi = bmi_of(p["weight"], p["height"])
    glu = p.get("glucose", 90)
    dm_flag = bool(p.get("diabetes")) or glu >= 126
    r = cvd_risk(p["age"], p["sex"], bmi, p["sbp"], p.get("bp_treated", False), p.get("smoker", False), dm_flag)
    pts, dcat, parts = diabetes_score(p["age"], bmi, p["sbp"], p.get("dbp", 80), p.get("bp_treated", False),
                                      p.get("family", "none"), p.get("activity", 150), glu)
    conf, notes = confidence(p["age"], p.get("bp_measured", True), "glucose" in p, bmi)
    return dict(bmi=round(bmi, 1), cvd_risk_pct=round(100 * r, 1), cvd_category=cvd_category(r),
                diabetes_points=pts, diabetes_category=dcat, diabetes_parts=parts,
                confidence=conf, confidence_notes=notes)

def recommendations(p, res):
    out = {"Diet": [], "Exercise": [], "Checkups": []}
    if res["bmi"] >= 25: out["Diet"].append("Aim for a 5-7% weight loss over 6 months: smaller portions, fewer sugary drinks.")
    if p["sbp"] >= 130: out["Diet"].append("Cut salt below 5 g/day (limit pickles, papad, packaged snacks).")
    if p.get("glucose", 90) >= 100: out["Diet"].append("Swap refined grains for whole grains, add pulses and vegetables to each meal.")
    if p.get("alcohol", 0) > 7: out["Diet"].append("Reduce alcohol; stay within 14 drinks/week (men) or 7 (women).")
    if p.get("smoker"): out["Diet"].append("Ask your doctor about a quit-smoking plan - the single biggest cardiac win.")
    if not out["Diet"]: out["Diet"].append("Keep a plate rich in vegetables, fruit, pulses and whole grains.")
    if p.get("activity", 150) < 150: out["Exercise"].append("Build up to 150 min/week of brisk walking (30 min, 5 days).")
    else: out["Exercise"].append("Great activity level - add 2 days of strength training.")
    freq = {"Low": "every 12 months", "Moderate": "every 6 months", "High": "within 4 weeks, then every 3 months"}
    worst = max(res["cvd_category"], res["diabetes_category"], key=["Low", "Moderate", "High"].index)
    out["Checkups"].append(f"Blood pressure, fasting glucose and lipid profile {freq[worst]}.")
    if p.get("glucose", 90) >= 126: out["Checkups"].append("Fasting glucose is in the diabetic range: book a confirmatory HbA1c with a doctor.")
    return out

if __name__ == "__main__":      # self-test against published reference value
    ref = cvd_risk(30, "F", 22.5, 125, bp_treated=True)
    assert abs(ref - 0.015094) < 1e-5, ref
    print("OK  Framingham women ref (30y, BMI 22.5, treated SBP 125) =", round(100 * ref, 2), "%")
    print(assess(dict(age=52, sex="M", weight=82, height=170, sbp=138, dbp=88, smoker=True, glucose=108, activity=60, family="parent_sibling")))
