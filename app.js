const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');

// Configurar el bot de Telegram
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: false });

// Definir los pares de criptomonedas a monitorear y sus respectivos porcentajes mínimos
const symbols = {
  'BTCUSDT': 2,
  'ETHUSDT': 4,
  'ADAUSDT': 4,
  'CHRUSDT': 4,
  'SOLUSDT': 3,
  'ALPHAUSDT': 4,
  //'CHESSUSDT': 4,
  '1000CATUSDT': 4,
  'APTUSDT': 3,
  'POPCATUSDT': 4,
  'UNIUSDT': 4,
  'GALAUSDT': 4,
  'LINKUSDT': 4,
  //'KASSUSDT': 4,
  'RUNEUSDT': 4,
  'ARPAUSDT': 4,
  'SXPUSDT': 4,
  'ATOMUSDT': 5,
  'XRPUSDT': 5,
  'CFXUSDT': 7,
  'COCOSUSDT': 6,
  'ONTUSDT': 4,
  'LINAUSDT': 4,
  'PEOPLEUSDT': 4,
  'LTCUSDT': 4,
  'ACHUSDT': 6,
  'AXSUSDT': 5,
  'PHBUSDT': 5,
  'MANAUSDT': 5,
  'XRPUSDT': 4,
  'SANDUSDT': 5,
  'OPUSDT': 5,
  'CTSIUSDT': 5,
  'RNDRUSDT': 5,
  'AVAXUSDT': 5,
  'RLCUSDT': 5,
  'IDEXUSDT': 5,
  'APEUSDT': 5,
  'TOMOUSDT': 5,
  'ANTUSDT': 5,
  'ZECUSDT': 4,
  'MASKUSDT': 5,
  'IOTAUSDT': 5,
  'TRXUSDT': 5,
  '1000PEPEUSDT': 4,
  'RUNEUSDT': 5,
  'GMTUSDT': 5,
  'KAVAUSDT': 5,
  'IMXUSDT': 5,
  'HIGHUSDT': 5,
  'SFPUSDT': 5,
  'SUIUSDT': 5,
  'APTUSDT': 5,
  'WLDUSDT': 5,
  'ZENUSDT': 5,
  'DOGEUSDT': 5,
  'UNFIUSDT': 8,
  'aixbtusdt': 5,
  'ARCUSDT': 5,
  'COOKIEUSDT': 5,
  'TRUMPUSDT': 5,
  'VIRTUALUSDT': 5,
  'HFTUSDT': 5,
  'RAYSOLUSDT': 5,
  'DEXEUSDT': 5,
  '1000BONKUSDT': 5,
  'CATIUSDT': 5,
  'CATIUSDT': 5,
  'FETUSDT': 5,
  'KOMAUSDT': 5,
  'SPXUSDT': 5,
  'AIUSDT': 5,
  'TROYUSDT': 5,
  'FLMUSDT': 5,
  'PHBUSDT': 5,
  'VANAUSDT': 4,
  'COWUSDT': 4,
  'SPELLUSDT': 5,
  'EDUUSDT': 5,
  'GOATUSDT': 4,
  'JUPUSDT': 4,
  'HBARUSDT': 4,
  'ENSUSDT': 4,
  'ALPACAUSDT': 7,
  'SYNUSDT': 5,
  'B3USDT': 5,
  'TURBOUSDT': 5,
  'KDAUSDT': 5,
  'AEROUSDT': 5,
  'POLUSDT': 5,
  'MAGICUSDT': 5,
  'BSWUSDT': 5,
  'LEVERUSDT': 5,
  'BNBUSDT': 4
  // Agrega aquí los demás pares de criptomonedas que deseas monitorear
};

const interval = 350000; // 5 minutos en milisegundos

// Variables para almacenar los precios anteriores y la hora de la última notificación por cada símbolo
const lastPrices = {};
const lastNotificationTimes = {};

// Función para obtener el precio actual y volumen de las últimas 24 horas de un par de criptomonedas y enviarlo a Telegram si cambia más del porcentaje mínimo establecido
const getPriceAndSendToTelegram = (symbol, minPercentageChange) => {
  axios.get(`https://fapi.binance.com/fapi/v1/ticker/24hr?symbol=${symbol}`)
    .then((response) => {
      const currentPrice = parseFloat(response.data.lastPrice);
      const volumeUSDT = parseFloat(response.data.volume);

     /* if (lastPrices[symbol] !== undefined) {
        const percentageChange = Math.abs(currentPrice - lastPrices[symbol]) / lastPrices[symbol] * 100;
        const currentTime = new Date().getTime();
        let message;

        if (percentageChange >= minPercentageChange && (lastNotificationTimes[symbol] === undefined || currentTime - lastNotificationTimes[symbol] >= 600000)) {
          if (currentPrice > lastPrices[symbol]) {
            message = `CRYPTO ROGER 🚀\nEl precio del par ${symbol} ha cambiado un ${percentageChange.toFixed(2)}%. Posible 🚨SHORT🚨\n 💰 Precio actual: ${currentPrice.toFixed(2)}\nPrecio anterior: ${lastPrices[symbol].toFixed(2)}\n📊 Volumen en USDT (24 horas): ${volumeUSDT.toFixed(2)}`;
          } else {
            message = `CRYPTO ROGER 🚀\nEl precio del par ${symbol} ha cambiado un ${percentageChange.toFixed(2)}%. Posible 🚨LONG.🚨\n 💰 Precio actual: ${currentPrice.toFixed(2)}\nPrecio anterior: ${lastPrices[symbol].toFixed(2)}\n📊 Volumen en USDT (24 horas): ${volumeUSDT.toFixed(2)}`;
          }
          bot.sendMessage('@Crytonotificaro', message);
          lastNotificationTimes[symbol] = currentTime;*/
        

       // Obtener Funding Fee
       axios.get(`https://fapi.binance.com/fapi/v1/fundingRate?symbol=${symbol}`)
       .then((fundingResponse) => {
         const fundingFee = parseFloat(fundingResponse.data[0]?.fundingRate) || 0; // Funding Fee para el par

         if (lastPrices[symbol] !== undefined) {
           const percentageChange = Math.abs(currentPrice - lastPrices[symbol]) / lastPrices[symbol] * 100;
           const currentTime = new Date().getTime();
           let message;

           if (percentageChange >= minPercentageChange && (lastNotificationTimes[symbol] === undefined || currentTime - lastNotificationTimes[symbol] >= 600000)) {
             if (currentPrice > lastPrices[symbol]) {
               message = `CRYPTO ROGER 🚀\nEl precio del par ${symbol} ha cambiado un ${percentageChange.toFixed(2)}%. Posible 🚨SHORT🚨\n💰 Precio actual: ${currentPrice.toFixed(4)}\nPrecio anterior: ${lastPrices[symbol].toFixed(4)}\n📊 Volumen en USDT (24 horas): ${volumeUSDT.toFixed(4)}\n🔄 Funding Fee: ${fundingFee.toFixed(6)}`;
             } else {
               message = `CRYPTO ROGER 🚀\nEl precio del par ${symbol} ha cambiado un ${percentageChange.toFixed(2)}%. Posible 🚨LONG🚨\n💰 Precio actual: ${currentPrice.toFixed(4)}\nPrecio anterior: ${lastPrices[symbol].toFixed(4)}\n📊 Volumen en USDT (24 horas): ${volumeUSDT.toFixed(4)}\n🔄 Funding Fee: ${fundingFee.toFixed(6)}`;
             }
             bot.sendMessage('@Crytonotificaro', message);
             lastNotificationTimes[symbol] = currentTime;
           }
         }

         lastPrices[symbol] = currentPrice;
       })
       .catch((fundingError) => {
         console.error(`Error obteniendo el Funding Fee para ${symbol}:`, fundingError);
       });
   })
   .catch((priceError) => {
     console.error(`Error obteniendo el precio para ${symbol}:`, priceError);
   });
};

// Llamar a la función para obtener el precio y enviar notificación si corresponde para cada símbolo
for (const symbol in symbols) {
 const minPercentageChange = symbols[symbol];
 setInterval(() => {
   getPriceAndSendToTelegram(symbol, minPercentageChange);
 }, interval);
}

// Mensaje en la terminal de Linux
console.log("🚀 El Bot CRYPTO ROGER ha iniciado con éxito");

// Mensaje a tu canal de Telegram
bot.sendMessage('@Crytonotificaro', "🚀 *¡Bot CRYPTO ROGER en línea!* \n\n✅ Monitoreando 87 pares.\n⏱️ Intervalo: " + (interval/60000).toFixed(1) + " min.", { parse_mode: 'Markdown' })
  .then(() => console.log("✅ Notificación de inicio enviada a Telegram"))
  .catch((err) => console.error("❌ Error enviando a Telegram:", err));

// ESTO ES LO QUE DEBES AGREGAR AL FINAL:
console.log("--------------------------------------------------");
console.log("🚀 El Bot CRYPTO ROGER ha iniciado con éxito");
console.log(`📈 Monitoreando ${Object.keys(symbols).length} pares de criptos`);
console.log(`⏰ Intervalo de chequeo: ${interval / 60000} minutos`);
console.log("--------------------------------------------------");

