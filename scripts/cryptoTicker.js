// cryptoTicker.js

let coins = [
    { name: "BTC" },
    { name: "ETH" },
    { name: "SOL" },
    { name: "XRP" },
    { name: "DOGE" },
    { name: "AVAX" },
    { name: "ADA" },
    { name: "LINK" },
    { name: "MATIC"}
];

let positions = [];
let speed = 1.2;
let fontSize = 12;
let tickerHeight = 24;
let dotSpacing = 4;
let dotSize = 1.2;
let uncBlue, dotGray;

let lastUpdateTime = 0;
let updateInterval = 0;

function setup() {
    createCanvas(windowWidth, tickerHeight);
    textFont('monospace');
    textSize(fontSize);
    textAlign(LEFT, CENTER);
    uncBlue = color(0, 170, 255);
    dotGray = color(19, 41, 75, 80);
    
    let x = width;
    for (let i = 0; i < coins.length; i++) {
        let label = coins[i].name;
        positions[i] = x;
        x += textWidth(label) + 60;
    }
    
    updateInterval = random(2000, 3000);
    lastUpdateTime = millis();
    updatePrices();
}

function draw() {
    clear();
    drawDotMatrix();
    
    if (millis() - lastUpdateTime > updateInterval) {
        updatePrices();
        lastUpdateTime = millis();
        updateInterval = random(2000, 3000);
    }
    
    fill(uncBlue);
    for (let i = 0; i < coins.length; i++) {
        let label = formatCoin(coins[i]);
        text(label, positions[i], tickerHeight / 2);
        positions[i] -= speed;
        
        if (positions[i] < -textWidth(label)) {
            let maxX = max(...positions);
            positions[i] = maxX + textWidth(label) + 60;
        }
    }
}

function drawDotMatrix() {
    noStroke();
    fill(dotGray);
    for (let y = dotSpacing / 2; y < height; y += dotSpacing) {
        for (let x = dotSpacing / 2; x < width; x += dotSpacing) {
            ellipse(x, y, dotSize, dotSize);
        }
    }
}

async function updatePrices() {
    const coinMap = {
        BTC: 'bitcoin',
        ETH: 'ethereum',
        SOL: 'solana',
        XRP: 'ripple',
        DOGE: 'dogecoin',
        AVAX: 'avalanche-2',
        ADA: 'cardano',
        LINK: 'chainlink',
        MATIC: 'matic-network'
    };
    
    const ids = Object.values(coinMap).join(',');
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        for (let i = 0; i < coins.length; i++) {
            const cgId = coinMap[coins[i].name];
            const livePrice = data[cgId]?.usd;
            if (livePrice) {
                coins[i].price = livePrice;
            }
        }
    } catch (err) {
        console.error("Failed to fetch live prices:", err);
    }
}

function formatCoin(coin) {
    if (coin.price === undefined) return coin.name;
    
    let p = coin.price > 1 ? coin.price.toFixed(2) : coin.price.toFixed(5);
    return `${coin.name}: $${p}`;
}

function windowResized() {
    resizeCanvas(windowWidth, tickerHeight);
}
