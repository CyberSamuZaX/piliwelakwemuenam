import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const response = await axios.post(
        'https://api.anthropic.com/v1/messages', 
        {
          model: "claude-3-sonnet-20240229",
          max_tokens: 300,
          messages: req.body.messages
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': process.env.ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01'
          }
        }
      )

      res.status(200).json(response.data)
    } catch (error) {
      console.error('API call error:', error)
      res.status(500).json({ error: 'Failed to fetch AI response' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
