def generate_recommendations(risk):

    if risk == "CRITICAL":
        return [
            "Immediate evacuation of vulnerable coastal regions.",
            "Suspend all fishing and marine activities.",
            "Activate emergency shelters and disaster response teams.",
            "Prepare hospitals and medical resources."
        ]

    elif risk == "HIGH":
        return [
            "Monitor cyclone movement continuously.",
            "Prepare evacuation routes.",
            "Alert local authorities.",
            "Issue public safety advisories."
        ]

    else:
        return [
            "Continue monitoring weather conditions.",
            "Maintain readiness of emergency services."
        ]