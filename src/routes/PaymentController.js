/* eslint-disable require-jsdoc */

class PaymentController {
  paymentService
  constructor(paymentService) {
    this.paymentService = paymentService
  }
  async getMercadoPagoLink(req, res, next) {
    try {
      const checkout = await this.paymentService.createPaymentMercadoPago(req.body)
      return res.status(200).json({ init_point: checkout.init_point })
    } catch (err) {
      return res.status(500).json({ error: true, msg: err, })
    }
  }
  webhook = (req, res) => {
    if (req.method === 'POST') {
      let body = ''
      req.on('data', (chunk) => {
        body += chunk.toString()
      })
      req.on('end', () => {
        console.log(body, 'webhook response')
        res.end('ok')
      })
    }
    return res.status(200).send()
  }
}

module.exports = PaymentController;