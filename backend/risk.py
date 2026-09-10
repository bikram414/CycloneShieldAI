def calculate_risk(wind_speed):

    if wind_speed >= 150:
        return "CRITICAL"

    elif wind_speed >= 100:
        return "HIGH"

    elif wind_speed >= 60:
        return "MEDIUM"

    else:
        return "LOW"