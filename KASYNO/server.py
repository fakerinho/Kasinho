from flask import Flask, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

# KONFIGURACJA WAG (Tu ustawiasz szanse dla Wielmożnego Kasyna)
SYMBOLS = [
    {"name": "🍒", "weight": 60, "payout": 0.40},
    {"name": "🍉", "weight": 25, "payout": 1.60},
    {"name": "💰", "weight": 10, "payout": 4.00},
    {"name": "7️⃣", "weight": 4, "payout": 10.00},
    {"name": "💎", "weight": 1, "payout": 20.00},
    {"name": "⭐", "weight": 0.8, "payout": 0} # Gwiazda to BONUS
]

@app.route('/spin', methods=['GET'])
def spin():
    names = [s['name'] for s in SYMBOLS]
    weights = [s['weight'] for s in SYMBOLS]
    
    # Losowanie 3 bębnów przez Pythona
    res = random.choices(names, weights=weights, k=3)
    
    win = 0
    is_bonus = "⭐" in res

    # Sprawdzanie wygranej (3 takie same)
    if res[0] == res[1] == res[2]:
        symbol_data = next(s for s in SYMBOLS if s['name'] == res[0])
        win = symbol_data['payout']
    # Bonus pocieszenia: 2 wiśnie na początku
    elif res[0] == "🍒" and res[1] == "🍒":
        win = 0.10

    return jsonify({
        "symbols": res,
        "win": win,
        "isBonus": is_bonus,
        "bet": 0.20
    })

if __name__ == '__main__':
    print("Serwer Wielmożnego Kasyna pracuje na porcie 5000...")
    app.run(port=5000)