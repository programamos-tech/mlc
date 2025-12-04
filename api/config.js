// Vercel Serverless Function
// Este endpoint sirve las configuraciones desde variables de entorno
// https://vercel.com/docs/functions/serverless-functions

export default function handler(req, res) {
    // CORS headers para permitir requests desde tu dominio
    res.setHeader('Access-Control-Allow-Origin', '*'); // En producción, cambia * por tu dominio específico
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    // Solo permitir GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        // Configuración de Facebook Pixel
        const facebookConfig = {
            PIXEL_ID: process.env.FACEBOOK_PIXEL_ID || '',
            // CONVERSION_API_TOKEN se mantiene privado y solo se usa server-side
        };
        
        // Configuración de EmailJS (estas son públicas por naturaleza de EmailJS)
        const emailjsConfig = {
            PUBLIC_KEY: process.env.EMAILJS_PUBLIC_KEY || '',
            SERVICE_ID: process.env.EMAILJS_SERVICE_ID || '',
            TEMPLATE_ID: process.env.EMAILJS_TEMPLATE_ID || ''
        };
        
        // Validar que las variables existan
        const isConfigured = 
            facebookConfig.PIXEL_ID && 
            emailjsConfig.PUBLIC_KEY && 
            emailjsConfig.SERVICE_ID && 
            emailjsConfig.TEMPLATE_ID;
        
        // Devolver configuraciones
        res.status(200).json({
            success: true,
            configured: isConfigured,
            facebook: facebookConfig,
            emailjs: emailjsConfig
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: 'Error al cargar configuración'
        });
    }
}



