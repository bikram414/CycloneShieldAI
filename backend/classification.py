import random

def classify_cyclone():

    categories = [
        "Depression",
        "Deep Depression",
        "Cyclonic Storm",
        "Severe Cyclonic Storm",
        "Very Severe Cyclonic Storm"
    ]

    category = random.choice(categories)

    confidence = round(
        random.uniform(85, 98),
        2
    )

    if category in [
        "Very Severe Cyclonic Storm",
        "Severe Cyclonic Storm"
    ]:
        risk = "CRITICAL"

    elif category == "Cyclonic Storm":
        risk = "HIGH"

    else:
        risk = "MEDIUM"

    return {
        "category": category,
        "risk": risk,
        "confidence": confidence
    }