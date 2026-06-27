import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key')
const EMAIL_FROM = process.env.EMAIL_FROM || 'hello@luxurybottles.com'

export async function sendOrderConfirmation(
  email: string,
  orderData: { orderNumber: string; total: string; items: any[] }
) {
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2>Thank you for your order!</h2>
      <p>Your order <strong>#${orderData.orderNumber}</strong> has been confirmed.</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <thead>
          <tr style="border-bottom: 1px solid #eee; text-align: left;">
            <th style="padding: 10px 0;">Item</th>
            <th style="padding: 10px 0;">Qty</th>
            <th style="padding: 10px 0;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${orderData.items
            .map(
              (item) => `
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0;">${item.name}</td>
              <td style="padding: 10px 0;">${item.quantity}</td>
              <td style="padding: 10px 0;">$${item.price}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
      <p style="text-align: right; margin-top: 20px; font-size: 1.2em;">
        <strong>Total: $${orderData.total}</strong>
      </p>
    </div>
  `

  if (process.env.NODE_ENV !== 'production' && !process.env.RESEND_API_KEY) {
    console.log('[Dev] Email would be sent to', email)
    return
  }

  await resend.emails.send({
    from: EMAIL_FROM,
    to: email,
    subject: `Order Confirmation #${orderData.orderNumber}`,
    html,
  })
}

export async function sendWelcomeEmail(email: string, firstName: string) {
  if (process.env.NODE_ENV !== 'production' && !process.env.RESEND_API_KEY) {
    console.log('[Dev] Welcome email would be sent to', email)
    return
  }

  await resend.emails.send({
    from: EMAIL_FROM,
    to: email,
    subject: 'Welcome to Luxury Bottles!',
    html: `<p>Hi ${firstName}, welcome to Luxury Bottles!</p>`,
  })
}
