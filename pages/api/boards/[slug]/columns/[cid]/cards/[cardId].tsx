import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/util/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const { cardId, columnId, slug } = req.query;

  const { db, client } = await connectToDatabase();

  if (client.isConnected()) {
    const requestType = req.method;

    switch (requestType) {
      case 'PATCH': {
        const { _id, boardName, columnName } = req.body;

        const data = {
          boardName,
          columnName
        };

        const board = await db.collection('columns').updateOne({ _id: cardId }, { $set: data });
        res.send(board);

        break;
      }

      case 'DELETE': {
        await db.collection('columns').deleteOne({ _id: cardId });

        res.send({ messsage: 'Deleted' });

        break;
      }

      default:
        res.send({ message: 'Invalid request type' });
        break;
    }
  } else {
    res.send({ msg: 'DB connection error', status: 400 });
  }
}
