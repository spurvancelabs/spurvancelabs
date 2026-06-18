import { CreateNotificationInput, Notification } from './types';
import { NotificationService } from './service';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export class NotificationTrigger {
  static async triggerNotification(input: CreateNotificationInput): Promise<Notification> {
    // Create the notification in database
    const notification = await NotificationService.createNotification(input);

    // Emit event for real-time updates using Supabase Realtime
    await this.emitEvent('notification:created', notification);

    // Check if user has preferences that require additional actions
    const preferences = await NotificationService.getPreferences(input.user_id);
    
    if (preferences) {
      // Send email if enabled
      if (preferences.email && preferences.types[input.type]?.email !== false) {
        await this.sendEmailNotification(notification, preferences);
      }

      // Send push notification if enabled
      if (preferences.push && preferences.types[input.type]?.push !== false) {
        await this.sendPushNotification(notification, preferences);
      }

      // Check quiet hours
      if (preferences.quiet_hours?.enabled) {
        const now = new Date();
        const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        const { start, end } = preferences.quiet_hours;
        
        if (this.isInQuietHours(currentTime, start, end)) {
          await this.queueForLater(notification);
        }
      }
    }

    return notification;
  }

  private static async emitEvent(event: string, data: any): Promise<void> {
    // Use Supabase Realtime
    const channel = supabase.channel('notifications');
    await channel.subscribe();
    await channel.send({
      type: 'broadcast',
      event: event,
      payload: data,
    });
    await channel.unsubscribe();
  }

  private static async sendEmailNotification(
    notification: Notification,
    preferences: any
  ): Promise<void> {
    // Implement email sending logic
    // Could use: Resend, SendGrid, Nodemailer, etc.
    console.log('Sending email notification:', notification);
    
    // Example with Resend (if you're using it)
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'notifications@yourapp.com',
    //   to: user.email,
    //   subject: notification.title,
    //   html: `<p>${notification.message}</p>`,
    // });
  }

  private static async sendPushNotification(
    notification: Notification,
    preferences: any
  ): Promise<void> {
    // Implement push notification logic
    // Could use: Firebase Cloud Messaging, OneSignal, etc.
    console.log('Sending push notification:', notification);
  }

  private static isInQuietHours(current: string, start: string, end: string): boolean {
    const [currHour, currMin] = current.split(':').map(Number);
    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);

    const currTotal = currHour * 60 + currMin;
    let startTotal = startHour * 60 + startMin;
    let endTotal = endHour * 60 + endMin;

    // Handle cases where quiet hours cross midnight
    if (startTotal > endTotal) {
      endTotal += 24 * 60;
      if (currTotal < startTotal) {
        const adjustedCurr = currTotal + 24 * 60;
        return adjustedCurr >= startTotal && adjustedCurr < endTotal;
      }
    }

    return currTotal >= startTotal && currTotal < endTotal;
  }

  private static async queueForLater(notification: Notification): Promise<void> {
    // Implement queuing logic
    // Could use: Bull, BullMQ, Redis, etc.
    console.log('Queuing notification for later:', notification);
  }
}