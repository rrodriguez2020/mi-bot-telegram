const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');

// Configurar el bot de Telegram
const bot = new TelegramBot('6254180778:AAGd7a9aKYXEEdf1vZkWh6gPFapkUBfkL4s', { polling: false });

// Definir el par de criptomonedas a monitorear
const symbol = 'XRPUSDT';

// Definir el intervalo de tiempo para enviar la información
const interval = 30000; // 15 minutos en milisegundos

// Función para obtener el precio actual del par de criptomonedas y enviarlo a Telegram

const getPriceAndSendToTelegram = () => {
  axios.get(`https://fapi.binance.com/fapi/v1/ticker/price?symbol=${symbol}`)
    .then((response) => {
      const currentPrice = parseFloat(response.data.price);
      const message = `CRYPTO ROGER 🚀\ Prueba de Mensaje con cuatro Decimales 😁\ El precio del par ${symbol} es: ${currentPrice.toFixed(4)}`;
      bot.sendMessage('@Crytonotificaro', message);
    })
    .catch((error) => {
      console.error(error);
    });
};

// Ejecutar la función para enviar el precio a Telegram cada 15 minutos
setInterval(getPriceAndSendToTelegram, interval);

