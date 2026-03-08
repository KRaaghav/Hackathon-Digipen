import express from 'express'
import cors from 'cors'

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

app.get('/api/canvas-ics', async (req, res) => {
  try {
    const url = req.query.url
    console.log('Canvas URL:', url)

    if (!url) {
      return res.status(400).send('Missing url')
    }

    const response = await fetch(url, { redirect: 'follow' })

    if (!response.ok) {
      const text = await response.text()
      console.log('Canvas error body:', text)
      return res.status(response.status).send(`Failed to fetch Canvas ICS: ${response.status}`)
    }

    const text = await response.text()
    res.setHeader('Content-Type', 'text/calendar')
    res.send(text)
  } catch (error) {
    console.error('Server error:', error)
    res.status(500).send(`Failed to fetch Canvas ICS: ${error.message}`)
  }
})

app.post('/api/estimate-workload', async (req, res) => {
  try {
    const { title, description } = req.body

    if (!title && !description) {
      return res.status(400).json({ error: 'Missing assignment content' })
    }

    const prompt = `
Estimate the number of hours a student would realistically spend on this school assignment.

Return ONLY valid JSON in this format:
{"hours": number, "reason": "short explanation"}

Rules:
- Use hours in increments like 0.5, 1, 1.5, 2, 3, 4, 6
- Small homework/discussion posts are usually 0.5 to 1.5 hours
- Quizzes are usually 0.5 to 2 hours
- Labs/problem sets are usually 2 to 4 hours
- Essays/projects can be 3 to 8 hours
- If unclear, make a reasonable moderate estimate

Title: ${title || ''}
Description: ${description || ''}
`.trim()

    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.2,
        messages: [
          { role: 'system', content: 'You estimate student workload for assignments.' },
          { role: 'user', content: prompt }
        ]
      })
    })

    if (!aiResponse.ok) {
      const text = await aiResponse.text()
      return res.status(aiResponse.status).send(text)
    }

    const data = await aiResponse.json()
    const content = data.choices?.[0]?.message?.content || '{"hours":1,"reason":"default"}'

    let parsed
    try {
      parsed = JSON.parse(content)
    } catch {
      parsed = { hours: 1, reason: 'Fallback estimate' }
    }

    res.json(parsed)
  } catch (error) {
    console.error('Estimate workload error:', error)
    res.status(500).json({ error: error.message })
  }
})

app.listen(PORT, () => {
  console.log(`Canvas proxy running on http://localhost:${PORT}`)
})