const { cmd } = require('../command')
const fetch = require('node-fetch')

// Conversation memory storage
const conversationMemory = new Map()

// Update user's conversation memory
function updateMemory(userId, role, content) {
  if (!conversationMemory.has(userId)) {
    conversationMemory.set(userId, [])
  }
  const userMemory = conversationMemory.get(userId)
  userMemory.push({ role, content })
  
  // Keep only last 20 messages
  if (userMemory.length > 30) {
    userMemory.shift()
  }
}

// Get conversation context
function getContext(userId) {
  if (!conversationMemory.has(userId)) return ''
  return conversationMemory.get(userId).map(msg => 
    `${msg.role}: ${msg.content}`
  ).join('\n')
}

// Check for abusive language
function isAbusive(text) {
  const abusiveWords = ['stupid', 'idiot', 'dumb', 'fool', 'shit', 'fuck', 'asshole', 'bitch']
  return abusiveWords.some(word => text.toLowerCase().includes(word))
}

// Check for greetings
function isGreeting(text) {
  const greetings = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening']
  return greetings.some(greet => text.toLowerCase().includes(greet))
}

// Enhanced Marisel AI with Gifted Tech Groq API
cmd({
  pattern: 'marisel',
  alias: ['ds', 'deepseek'],
  desc: 'Ask Marisel AI a question',
  category: 'ai',
  filename: __filename,
  use: '.marisel <your question>'
}, async (conn, m, textInfo, { args, from, reply, sender }) => {
  const query = args.join(" ").trim()
  if (!query) {
    await conn.sendMessage(
      from,
      {
        text: 'Please ask something like `.marisel what is free will?`',
        contextInfo: {
          mentionedJid: [m.sender],
          forwardingScore: 999,
          isForwarded: true
        }
      },
      { quoted: m }
    )
    return
  }

  // Handle abuse
  if (isAbusive(query)) {
    await conn.sendMessage(
      from,
      {
        text: "*Hold your horses please! Respect and don't abuse people.*",
        contextInfo: {
          mentionedJid: [m.sender],
          forwardingScore: 999,
          isForwarded: true
        }
      },
      { quoted: m }
    )
    return
  }

  // Handle greetings
  if (isGreeting(query)) {
    await conn.sendMessage(
      from,
      {
        text: "*Hello! How may Marisel AI help you today?*",
        contextInfo: {
          mentionedJid: [m.sender],
          forwardingScore: 999,
          isForwarded: true
        }
      },
      { quoted: m }
    )
    return
  }

  const q = query.toLowerCase()

  // Handle creator/identity questions
  if (q.includes("who made you") || q.includes("who created you") || q.includes("who is your owner") || 
      q.includes("who developed you") || q.includes("who are you") || q.includes("what are you") ||
      q.includes("who is marisel")) {
    await conn.sendMessage(
      from,
      {
        text: `*About Me:*\n\n*I'm Marisel AI, created by Marisel, a 21-year-old full stack developer from Kenya. I'm part of a family that includes Mercedes and Bugatti bots, all available on GitHub.*\n\n> How may I assist you today?`,
        contextInfo: {
          mentionedJid: [m.sender],
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363299029326322@newsletter',
            newsletterName: "𝖒𝖆𝖗𝖎𝖘𝖊𝖑",
            serverMessageId: 143
          }
        }
      },
      { quoted: m }
    )
    return
  }

  // Handle language model questions
  if (q.includes("language model") || q.includes("llm") || q.includes("what model")) {
    await conn.sendMessage(
      from,
      {
        text: `*Only Marisel knows my specific language models, but I was created to help you in your day-to-day activities.*\n\n*What would you like to discuss today?*`,
        contextInfo: {
          mentionedJid: [m.sender],
          forwardingScore: 999,
          isForwarded: true
        }
      },
      { quoted: m }
    )
    return
  }

  // Update conversation memory
  updateMemory(sender, 'user', query)
  
  // Construct personality prompt
  const personality = `
    You are Marisel AI - an intelligent assistant that provides helpful, detailed responses.
    Current conversation context:
    ${getContext(sender)}
  `

  try {
    // First try Gifted Tech Groq API
    const groqUrl = `https://api.giftedtech.web.id/api/ai/groq-beta?apikey=gifted&q=${encodeURIComponent(personality + "\n\n" + query)}`
    const groqRes = await fetch(groqUrl)
    let response = ''
    let apiUsed = 'Gifted Tech Groq'

    if (groqRes.ok) {
      const groqData = await groqRes.json()
      response = groqData.result || groqData.response || ''
    }

    // Fallback to DeepSeek if Groq fails
    if (!response) {
      apiUsed = 'DeepSeek'
      const deepseekUrl = `https://api.nekorinn.my.id/ai/deepseek-r1?text=${encodeURIComponent(personality)}\n\nUser Query: ${encodeURIComponent(query)}`
      const deepseekRes = await fetch(deepseekUrl)
      const deepseekJson = await deepseekRes.json()
      response = deepseekJson?.result?.text || "I couldn't generate a response"
    }

    // Update memory with AI response
    updateMemory(sender, 'assistant', response)
    
    // Add follow-up question if not present
    if (!response.includes('?') && !response.endsWith('?')) {
      const followUps = [
        "\n\n*Would you like me to elaborate on this?*",
        "\n\n*Is there anything else you'd like to know?*",
        "\n\n*Should I provide more details about this?*",
        "\n\n*Does this fully answer your question?*",
        "\n\n*How else may I assist you with this?*"
      ]
      response += followUps[Math.floor(Math.random() * followUps.length)]
    }
    
    // Send formatted response
    await conn.sendMessage(
      from,
      {
        text: `*Marisel AI (via ${apiUsed}):*\n\n${response}\n\n> Powered by Marisel Technologies`,
        contextInfo: {
          mentionedJid: [m.sender],
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363299029326322@newsletter',
            newsletterName: "𝖒𝖆𝖗𝖎𝖘𝖊𝖑",
            serverMessageId: 143
          }
        }
      },
      { quoted: m }
    )

  } catch (e) {
    console.error('AI Error:', e)
    await conn.sendMessage(
      from,
      {
        text: `❌ An error occurred. Please try again later.\nError: ${e.message}`,
        contextInfo: {
          mentionedJid: [m.sender],
          forwardingScore: 999,
          isForwarded: true
        }
      },
      { quoted: m }
    )
  }
})
