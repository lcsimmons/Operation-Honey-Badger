// File: pages/api/translate.js
import { Translate } from '@google-cloud/translate/build/src/v2';

// At the top of your translate.js API file
console.log("API Key available:", !!process.env.GOOGLE_TRANSLATE_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text, targetLanguage } = req.body;

    if (!text || !targetLanguage) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Get API key from environment variables
    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    // Instantiate the client with the API key
    const translate = new Translate({ key: apiKey });
    
    // Perform translation
    const [translations] = await translate.translate(text, targetLanguage);
    
    // Format response based on whether input was an array or single string
    const formattedTranslations = Array.isArray(translations) 
      ? translations.map(translation => ({ translatedText: translation }))
      : [{ translatedText: translations }];

    return res.status(200).json({ 
      translations: formattedTranslations
    });
    
  } catch (error) {
    console.error('Translation API error:', error);
    return res.status(500).json({ error: 'Failed to translate text', details: error.message });
  }
}