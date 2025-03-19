import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import json
import os
import requests

# Función para obtener el precio actual de Bitcoin
def get_current_bitcoin_price():
    url = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        return data["bitcoin"]["usd"]
    else:
        raise Exception("Error al obtener el precio de Bitcoin")

# Función para generar datos históricos simulados
def generate_historical_data(days=30, initial_price=40000):
    np.random.seed(42)  # Para reproducibilidad
    start_date = datetime.now() - timedelta(days=days)
    dates = [start_date + timedelta(hours=i) for i in range(days * 24)]  # Datos por hora
    prices = initial_price + np.cumsum(np.random.randn(days * 24)) * 100  # Tendencia con ruido
    return pd.DataFrame({'date': dates, 'price': prices})

# Función para generar predicciones futuras por hora
def generate_future_predictions(start_date, initial_price, future_hours=24):
    future_dates = [start_date + timedelta(hours=i) for i in range(1, future_hours + 1)]
    future_prices = initial_price + np.cumsum(np.random.randn(future_hours)) * 50  # Tendencia con ruido
    return pd.DataFrame({'date': future_dates, 'price': future_prices})

# Función para convertir objetos Timestamp a cadenas
def convert_timestamps_to_strings(data):
    return [
        {
            "date": entry["date"].strftime("%Y-%m-%dT%H:%M:%S"),  # Formato ISO 8601
            "price": entry["price"]
        }
        for entry in data
    ]

# Función principal
def main():
    # Obtener el precio actual de Bitcoin
    try:
        current_price = get_current_bitcoin_price()
        print(f"Precio actual de Bitcoin: ${current_price}")
    except Exception as e:
        print(f"Error: {e}")
        current_price = 40000  # Valor predeterminado si falla la API

    # Ruta a la carpeta `public` de React (ajusta la ruta según tu proyecto)
    public_folder = os.path.join(os.path.dirname(__file__), '..', '..', 'public')
    if not os.path.exists(public_folder):
        os.makedirs(public_folder)

    # Generar datos históricos
    historical_data = generate_historical_data(initial_price=current_price)

    # Obtener la hora actual como punto de partida para las predicciones
    current_time = datetime.now()

    # Generar predicciones futuras por hora (1 día)
    future_data_1D = generate_future_predictions(current_time, current_price, future_hours=24)

    # Generar predicciones futuras por hora (1 semana)
    future_data_1W = generate_future_predictions(current_time, current_price, future_hours=24 * 7)

    # Generar predicciones futuras por hora (1 mes)
    future_data_1M = generate_future_predictions(current_time, current_price, future_hours=24 * 30)

    # Convertir objetos Timestamp a cadenas
    predictions = {
        "1D": convert_timestamps_to_strings(future_data_1D.to_dict('records')),
        "1W": convert_timestamps_to_strings(future_data_1W.to_dict('records')),
        "1M": convert_timestamps_to_strings(future_data_1M.to_dict('records')),
    }

    # Guardar el archivo JSON en la carpeta `public`
    output_path = os.path.join(public_folder, 'predictions.json')
    with open(output_path, 'w') as f:
        json.dump(predictions, f, indent=4)

    print(f"Datos guardados en {output_path}")

if __name__ == "__main__":
    main()