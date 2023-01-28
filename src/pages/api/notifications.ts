// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { notificationService } from '@/server/modules/Notifications/notificationService';
import type { NextApiRequest, NextApiResponse } from 'next'

const notificationServiceController = notificationService();

const controllerBy = { 
  GET: notificationServiceController.getPublicKey,
  POST: notificationServiceController.register,
  PUT: notificationServiceController.send
} as any

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (controllerBy[req.method as any]) return controllerBy[req.method as any](req, res);

  res.status(405).json({
    message: "Method not allowed"
  })
}
