// File: pages/api/tts.js
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text, languageCode = 'en-US' } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Get API key from environment variables (same key used for translation)
    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
    
    if (!apiKey) {
      console.error('API key not configured');
      return res.status(500).json({ error: 'API key not configured' });
    }

    console.log(`TTS API called for language: ${languageCode}, text length: ${text.length}`);

    // Prepare the request body
    const requestBody = {
      input: { text },
      voice: {
        languageCode,
        ssmlGender: 'NEUTRAL'
      },
      audioConfig: { audioEncoding: 'MP3' }
    };

    // Make request to Google Text-to-Speech API
    try {
      const response = await axios({
        method: 'post',
        url: `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
        headers: {
          'Content-Type': 'application/json'
        },
        data: requestBody,
        timeout: 10000 // 10 second timeout
      });

      // The API returns base64 encoded audio content
      const audioContent = response.data.audioContent;
      
      if (!audioContent) {
        console.error('No audio content received from Google TTS API');
        return res.status(500).json({ error: 'No audio content received' });
      }
      
      // Convert base64 to buffer
      const audioBuffer = Buffer.from(audioContent, 'base64');

      // Send the audio content
      res.setHeader('Content-Type', 'audio/mp3');
      return res.status(200).send(audioBuffer);
    } catch (apiError) {
      console.error('Google TTS API error:', apiError.response?.data || apiError.message);
      
      // Check if it's an authentication or quota issue
      if (apiError.response?.status === 403 || apiError.response?.status === 429) {
        return res.status(403).json({ 
          error: 'API access denied or quota exceeded',
          details: apiError.response?.data?.error?.message || 'Check your Google Cloud API key and quotas'
        });
      }
      
      return res.status(500).json({ 
        error: 'Error calling Google TTS API', 
        details: apiError.response?.data?.error?.message || apiError.message 
      });
    }
    
  } catch (error) {
    console.error('Server error in TTS API handler:', error);
    return res.status(500).json({ 
      error: 'Server error processing TTS request', 
      details: error.message 
    });
  }
}