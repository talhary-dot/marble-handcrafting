export interface OrderNotificationPayload {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingAddress: string
  city: string
  country: string
  deliveryMethod: string
  paymentMethod: string
  subtotal: number
  shippingCost: number
  totalAmount: number
  customInscription?: string | null
  items: Array<{
    id?: string
    name: string
    description?: string
    price: number
    quantity: number
  }>
  createdAt?: string
}

/**
 * Dispatches alerts when an acquisition order is placed at the Sang Tarash atelier.
 * Respects Zero Secrets: Reads exclusively from process.env with zero hardcoded credentials.
 */
export async function notifyStudioOfAcquisition(order: OrderNotificationPayload): Promise<{
  webhookSent: boolean
  emailSent: boolean
  logged: boolean
}> {
  let webhookSent = false
  let emailSent = false

  const webhookUrl = process.env.STUDIO_WEBHOOK_URL
  const resendApiKey = process.env.RESEND_API_KEY
  const studioEmail = process.env.STUDIO_ALERT_EMAIL || process.env.NEXT_PUBLIC_STUDIO_EMAIL

  // 1. Dispatch Webhook (e.g. Discord, Slack, or internal atelier ERP)
  if (webhookUrl) {
    try {
      const webhookPayload = {
        event: "order.created",
        timestamp: new Date().toISOString(),
        order: {
          id: order.id,
          customer: {
            name: order.customerName,
            email: order.customerEmail,
            phone: order.customerPhone,
            destination: `${order.city}, ${order.country}`
          },
          settlement: {
            method: order.paymentMethod,
            total: `$${order.totalAmount}`,
            tier: order.deliveryMethod
          },
          itemsCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
          inscription: order.customInscription || "None requested"
        }
      }

      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(webhookPayload)
      })
      webhookSent = true
    } catch (err) {
      console.warn("[Studio Notification] Webhook delivery failed:", err)
    }
  }

  // 2. Dispatch Email via Resend if configured
  if (resendApiKey && studioEmail) {
    try {
      const emailBody = `
==============================================
NEW SANG TARASH ACQUISITION ORDER: ${order.id}
==============================================

Collector: ${order.customerName}
Email: ${order.customerEmail}
Phone: ${order.customerPhone}
Delivery Address: ${order.shippingAddress}, ${order.city}, ${order.country}

Handling Tier: ${order.deliveryMethod}
Payment Avenue: ${order.paymentMethod}
Total Acquisition Value: $${order.totalAmount}
Custom Inscription: ${order.customInscription || "None"}

Items Ordered:
${order.items.map((it) => `- ${it.name} (${it.description || "Edition"}) x ${it.quantity} @ $${it.price}`).join("\n")}
`

      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: "Sang Tarash Atelier <orders@resend.dev>",
          to: studioEmail,
          subject: `[Atelier Order] ${order.customerName} - ${order.id} ($${order.totalAmount})`,
          text: emailBody
        })
      })
      emailSent = true
    } catch (err) {
      console.warn("[Studio Notification] Email delivery failed:", err)
    }
  }

  // 3. Structured Atelier Audit Log
  console.info(
    `[Atelier Order Dispatch] Order ${order.id} registered | Collector: ${order.customerName} | Value: $${order.totalAmount} | Webhook: ${webhookSent} | Email: ${emailSent}`
  )

  return { webhookSent, emailSent, logged: true }
}
