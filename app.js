require('dotenv').config();
const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: false });

const symbols = {
  'BTCUSDT': 2,
  'ETHUSDT': 2,
  'ADAUSDT': 3,
  'CHRUSDT': 4,
  'SOLUSDT': 2,
  'MATICUSDT': 2,
  'GALAUSDT': 2,
  'ARPAUSDT': 2,
  'SXPUSDT': 2,
  'ATOMUSDT': 2,
  'XRPUSDT': 2,
  'CFXUSDT': 2,
  'COCOSUSDT': 2,
  'ONTUSDT': 2,
  'LINAUSDT': 5,
  'PEOPLEUSDT': 2,
  'LTCUSDT': 2,
  'ACHUSDT': 2,
  'AXSUSDT': 3,
  'PHBUSDT': 3,
  'MANAUSDT': 3,
  'XRPUSDT': 3,
  'SANDUSDT': 3,
  'OPUSDT': 3,
  'CTSIUSDT': 3,
  'RNDRUSDT': 3,
  'AVAXUSDT': 3,
  'RLCUSDT': 3,
  'IDEXUSDT': 3,
  'APEUSDT': 3,
  'TOMOUSDT': 1,
  'ANTUSDT': 3,
  'ZECUSDT': 3,
  'MASKUSDT': 3,
  'IOTAUSDT': 3,
  'TRXUSDT': 2,
  '1000PEPEUSDT': 3,
  'GMTUSDT': 2,
  'KAVAUSDT': 2,
  'IMXUSDT': 2,
  'LINAUSDT': 2,
  'HIGHUSDT': 2,
  'BNBUSDT': 3
};

const checkInterval = 300000;  // 5 min
const reportInterval = 1600000; // 30 min

const lastPrices = {};
const lastNotificationTimes = {};
const currentData = {};

// 🔍 CHEQUEO CADA 5 MIN
const checkMarket = async () => {
  for (const symbol in symbols) {
    try {
      const minPercentageChange = symbols[symbol];

      const priceRes = await axios.get(`https://fapi.binance.com/fapi/v1/ticker/24hr?symbol=${symbol}`);
      const fundingRes = await axios.get(`https://fapi.binance.com/fapi/v1/fundingRate?symbol=${symbol}`);

      const currentPrice = parseFloat(priceRes.data.lastPrice);
      const volumeUSDT = parseFloat(priceRes.data.volume);
      const fundingFee = parseFloat(fundingRes.data[0]?.fundingRate) || 0;

      let percentageChange = 0;

      if (lastPrices[symbol]) {
        percentageChange = Math.abs(currentPrice - lastPrices[symbol]) / lastPrices[symbol] * 100;
      }

      // Guardar para reporte
      currentData[symbol] = {
        price: currentPrice,
        change: percentageChange,
        min: minPercentageChange,
        funding: fundingFee
      };

      console.log(`📊 ${symbol} | Precio: ${currentPrice} | Cambio: ${percentageChange.toFixed(2)}%`);

      // 🚨 ALERTAS
      if (lastPrices[symbol]) {
        const currentTime = Date.now();

        if (
          percentageChange >= minPercentageChange &&
          (lastNotificationTimes[symbol] === undefined ||
            currentTime - lastNotificationTimes[symbol] >= 600000)
        ) {
          let message;

          if (currentPrice > lastPrices[symbol]) {
            message = `CRYPTO ROGER 🚀
El precio del par ${symbol} ha cambiado un ${percentageChange.toFixed(2)}%. Posible 🚨SHORT🚨
💰 Precio actual: ${currentPrice.toFixed(4)}
Precio anterior: ${lastPrices[symbol].toFixed(4)}
📊 Volumen en USDT (24 horas): ${volumeUSDT.toFixed(4)}
🔄 Funding Fee: ${fundingFee.toFixed(6)}`;
          } else {
            message = `CRYPTO ROGER 🚀
El precio del par ${symbol} ha cambiado un ${percentageChange.toFixed(2)}%. Posible 🚨LONG🚨
💰 Precio actual: ${currentPrice.toFixed(4)}
Precio anterior: ${lastPrices[symbol].toFixed(4)}
📊 Volumen en USDT (24 horas): ${volumeUSDT.toFixed(4)}
🔄 Funding Fee: ${fundingFee.toFixed(6)}`;
          }

          await bot.sendMessage('@Crytonotificaro', message);
          lastNotificationTimes[symbol] = currentTime;
        }
      }

      lastPrices[symbol] = currentPrice;

    } catch (error) {
      console.error(`❌ Error en ${symbol}:`, error.message);
    }
  }
};

// 📊 REPORTE CADA 10 MIN
const sendReport = async () => {
  let report = `📊 REPORTE GENERAL\n⏱️ ${new Date().toLocaleTimeString()}\n\n`;

  for (const symbol in currentData) {
    const data = currentData[symbol];

    report += `📊 ${symbol}
💰 ${data.price.toFixed(4)}
Δ ${data.change.toFixed(2)}% (min ${data.min}%)
🔄 Funding: ${data.funding.toFixed(6)}

`;
  }

  try {
    await bot.sendMessage('@Crytonotificaro', report);
    console.log("📩 Reporte enviado");
  } catch (err) {
    console.error("❌ Error enviando reporte:", err.message);
  }
};

// 🔁 INTERVALOS
setInterval(checkMarket, checkInterval);
setInterval(sendReport, reportInterval);

// 🚀 INICIO
console.log("--------------------------------------------------");
console.log("🚀 BOT CRYPTO ROGER INICIADO");
console.log(`📈 Monitoreando ${Object.keys(symbols).length} pares`);
console.log(`⏱️ Chequeo: ${checkInterval / 60000} min`);
console.log(`📊 Reporte: ${reportInterval / 60000} min`);
console.log("--------------------------------------------------");

// 📩 MENSAJE INICIAL
bot.sendMessage(
  '@Crytonotificaro',
  `🚀 Bot en línea

📈 Monedas: ${Object.keys(symbols).length}
⏱️ Chequeo: ${checkInterval / 60000} min
📊 Reporte: ${reportInterval / 60000} min`
);
