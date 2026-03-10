// --- KONFIGURACJA LOGIKI (Zamiast Pythona) ---
const SYMBOLS = [
    { name: "🍒", weight: 60, payout: 0.40 },
    { name: "🍉", weight: 25, payout: 1.60 },
    { name: "💰", weight: 10, payout: 4.00 },
    { name: "7️⃣", weight: 4, payout: 10.00 },
    { name: "💎", weight: 1, payout: 20.00 },
    { name: "⭐", weight: 0.8, payout: 0 } // Gwiazda odpala Bonus
];

let balance = 100.00;
const bet = 0.20;

const spinBtn = document.getElementById('spin-btn');
const balanceDisplay = document.getElementById('balance');
const winDisplay = document.getElementById('win-amount');
const statusMsg = document.getElementById('status-msg');

// Funkcja losująca (Mózg gry)
function drawSymbols() {
    let results = [];
    const totalWeight = SYMBOLS.reduce((sum, s) => sum + s.weight, 0);

    for (let i = 0; i < 3; i++) {
        let random = Math.random() * totalWeight;
        for (let s of SYMBOLS) {
            if (random < s.weight) {
                results.push(s.name);
                break;
            }
            random -= s.weight;
        }
    }
    return results;
}

// Obsługa przycisku SPIN
spinBtn.addEventListener('click', () => {
    if (balance < bet) return alert("Brak środków w Wielmożnym Skarbcu!");

    spinBtn.disabled = true;
    balance -= bet;
    updateUI();
    
    statusMsg.innerText = "Losowanie...";
    statusMsg.style.color = "#aaa";

    // Udawana animacja (kręcenie symbolami)
    let count = 0;
    let anim = setInterval(() => {
        document.getElementById('reel1').innerText = SYMBOLS[Math.floor(Math.random()*SYMBOLS.length)].name;
        document.getElementById('reel2').innerText = SYMBOLS[Math.floor(Math.random()*SYMBOLS.length)].name;
        document.getElementById('reel3').innerText = SYMBOLS[Math.floor(Math.random()*SYMBOLS.length)].name;
        count++;
        if(count > 10) {
            clearInterval(anim);
            finalizeGame();
        }
    }, 70);
});

function finalizeGame() {
    const res = drawSymbols();
    
    // Wyświetlenie wyniku
    document.getElementById('reel1').innerText = res[0];
    document.getElementById('reel2').innerText = res[1];
    document.getElementById('reel3').innerText = res[2];

    let win = 0;
    let isBonus = res.includes("⭐");

    // Sprawdzanie wygranej
    if (res[0] === res[1] && res[1] === res[2]) {
        const symbolData = SYMBOLS.find(s => s.name === res[0]);
        win = symbolData.payout;
    } else if (res[0] === "🍒" && res[1] === "🍒") {
        win = 0.10;
    }

    if (win > 0) {
        balance += win;
        winDisplay.innerText = win.toFixed(2);
        statusMsg.innerText = `WYGRANA: ${win.toFixed(2)} PLN!`;
        statusMsg.style.color = "#00ff00";
    } else {
        statusMsg.innerText = "Spróbuj ponownie!";
    }

    if (isBonus) {
        triggerBonus();
    } else {
        spinBtn.disabled = false;
    }
    updateUI();
}

// Funkcja darmowych spinów
async function triggerBonus() {
    statusMsg.innerText = "⭐ BONUS: 3 DARMOWE SPINY! ⭐";
    statusMsg.style.color = "#ffcc00";
    
    for (let i = 1; i <= 3; i++) {
        await new Promise(r => setTimeout(r, 1500));
        const res = drawSymbols();
        
        document.getElementById('reel1').innerText = res[0];
        document.getElementById('reel2').innerText = res[1];
        document.getElementById('reel3').innerText = res[2];

        let win = 0;
        if (res[0] === res[1] && res[1] === res[2]) {
            win = SYMBOLS.find(s => s.name === res[0]).payout;
        } else if (res[0] === "🍒" && res[1] === "🍒") {
            win = 0.10;
        }

        balance += win;
        updateUI();
        statusMsg.innerText = `BONUS SPIN ${i}/3! +${win.toFixed(2)}`;
    }

    setTimeout(() => {
        statusMsg.innerText = "Koniec Bonusu!";
        spinBtn.disabled = false;
    }, 1000);
}

function updateUI() {
    balanceDisplay.innerText = balance.toFixed(2);
} 