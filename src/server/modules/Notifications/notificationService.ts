import { prisma } from "@/utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import WebPush from 'web-push'
import { z } from "zod";

// console.log(WebPush.generateVAPIDKeys())
const PUBLIC_KEY = process.env.PUBLIC_VAPID_KEY!;
const PRIVATE_KEY = process.env.PRIVATE_VAPID_KEY!;

WebPush.setVapidDetails(
  "https://localhost:3000",
  PUBLIC_KEY,
  PRIVATE_KEY
)

export const notificationService = () => ({
  getPublicKey: (_: NextApiRequest, res: NextApiResponse) => {
    return res.status(200).send({ publicKey: PUBLIC_KEY })
  },

  register: async (req: NextApiRequest, res: NextApiResponse) => {
    const sendPushBody = z.object({
      endpoint: z.string(),
      keys: z.object({
        p256dh: z.string(),
        auth: z.string(),
      })
    })
    const { endpoint, keys } = sendPushBody.parse(req.body);
    const alReadyExistsEndpoint = await prisma.user.findFirst({
      where: {
        notification: {
          equals: {
            endpoint: endpoint,
            keys: keys,
          }
        }
      }
    })

    if (!alReadyExistsEndpoint) {
      await prisma.user.create({
        data: {
          notification: {
            endpoint,
            keys,
          }
        }
      })
    }
    res.status(201).end();
  },

  send: async (req: NextApiRequest, res: NextApiResponse) => {
    const allUsers = await prisma.user.findMany();

    allUsers.forEach((user) => {
      WebPush.sendNotification(user.notification, "SUCESSO!")
    })

    res.status(201).end()
  }
})