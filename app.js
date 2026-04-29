require('dotenv').config();
const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: false });

const symbols = {
  'BTCUSDT': 2,
  'ETHUSDT': 1,
  'ADAUSDT': 1,
  'SOLUSDT': 3,
  'BNBUSDT': 4
};

const interval = 300000; // 5 minutos

const lastPrices = {};
const lastNotificationTimes = {};

// 🚀 FUNCIÓN PRINCIPAL
const processSymbols = async () => {
  let report = `📊 *REPORTE GENERAL*\n⏱️ ${new Date().toLocaleTimeString()}\n\n`;

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

      // 📊 LOG CONSOLA
      console.log(`📊 ${symbol} | Precio: ${currentPrice} | Cambio: ${percentageChange.toFixed(2)}%`);

      // 📊 ARMAR REPORTE TELEGRAM
      report += `📊 ${symbol}\n💰 ${currentPrice.toFixed(4)} | Δ ${percentageChange.toFixed(2)}% (min ${minPercentageChange}%)\n\n`;

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
            message = `🚀 *SHORT SIGNAL*\n${symbol}\n📈 Cambio: ${percentageChange.toFixed(2)}%`;
          } else {
            message = `🚀 *LONG SIGNAL*\n${symbol}\n📉 Cambio: ${percentageChange.toFixed(2)}%`;
          }

          await bot.sendMessage('@Crytonotificaro', message, { parse_mode: 'Markdown' });
          lastNotificationTimes[symbol] = currentTime;
        }
      }

      lastPrices[symbol] = currentPrice;

    } catch (error) {
      console.error(`❌ Error en ${symbol}:`, error.message);
    }
  }

  // 📩 ENVIAR REPORTE COMPLETO
  try {
    await bot.sendMessage('@Crytonotificaro', report, { parse_mode: 'Markdown' });
    console.log("📩 Reporte enviado a Telegram");
  } catch (err) {
    console.error("❌ Error enviando reporte:", err.message);
  }
};

// 🔁 UN SOLO INTERVALO
setInterval(processSymbols, interval);

// 🚀 INICIO
console.log("--------------------------------------------------");
console.log("🚀 BOT CRYPTO ROGER INICIADO");
console.log(`📈 Monitoreando ${Object.keys(symbols).length} pares`);
console.log(`⏰ Intervalo: ${interval / 60000} minutos`);
console.log("--------------------------------------------------");

// 📩 MENSAJE INICIAL
bot.sendMessage(
  '@Crytonotificaro',
  `🚀 *Bot en línea*\n\n📈 Monedas: ${Object.keys(symbols).length}\n⏱️ Intervalo: ${interval / 60000} min`,
  { parse_mode: 'Markdown' }
);
