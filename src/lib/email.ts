import { Resend } from 'resend'

let transporter: any = null
let resendClient: any = null

async function createTransporter() {
  if (!transporter && process.env.SMTP_HOST) {
    const nodemailer = await import('nodemailer')
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  }
  return transporter
}

interface SendEmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  if (process.env.SMTP_HOST && process.env.SMTP_HOST.length > 0) {
    try {
      const transport = await createTransporter()
      const result = await transport.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to,
        subject,
        html,
      })
      return { success: true, messageId: result.messageId }
    } catch (error) {
      console.error('SMTP send error:', error)
      return { success: false, error: (error as Error).message }
    }
  }

  if (process.env.RESEND_API_KEY && !resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY)
  }

  if (resendClient) {
    try {
      const result = await resendClient.emails.send({
        from: 'onboarding@resend.dev',
        to,
        subject,
        html,
      })
      if (!result.data) {
        console.error('Resend send failed:', result.error)
        return { success: false, error: result.error }
      }
      return { success: true }
    } catch (error) {
      console.error('Resend send error:', error)
      return { success: false, error: (error as Error).message }
    }
  }

  console.log('=== EMAIL DEBUG (no email service configured) ===')
  console.log('To:', to)
  console.log('Subject:', subject)
  console.log('HTML:', html)
  console.log('=====================================')
  return { success: true, preview: 'Check console for email preview' }
}
