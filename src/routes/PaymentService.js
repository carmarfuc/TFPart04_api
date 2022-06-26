/* eslint-disable require-jsdoc */
const mercadopagoSDK = require('mercadopago')

const mercadoSDKInit = async () => {
  try {
    await mercadopagoSDK.configure({
      access_token: 'TEST-2095263625448057-060417-f3896b4e4e02c5f0e7452765252b5ba6-183610839',
    })
    return true
  } catch (err) {
    return err
  }
}

mercadoSDKInit()

class PaymentService {
  mercadopago;

  constructor() {
    this.mercadopago = mercadopagoSDK
  }

  async createPaymentMercadoPago(products) {
    const preference = {
      items: products.map(p => {
        return { title: p.description, unit_price: p.price, quantity: 1 }
      }),
      back_urls: {
        success: `https://tfp-art04-client.vercel.app/successOrder`, // CAMBIAR POR EL FRONT DEPLOYADO
        pending: `https://tfp-art04-client.vercel.app/home`,
        failure: `https://tfp-art04-client.vercel.app/home`,
      },
      // notification_url: 'http://localhost:3001/mercadopago/feedback', // CAMBIAR POR UNA RUTA DE BACK DEPLOYADO
      auto_return: 'approved',
    }

    try {
      const response = await this.mercadopago.preferences.create(preference)
      return response.body
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = {
  mercadoSDKInit,
  PaymentService
};