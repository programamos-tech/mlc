// Vercel Serverless Function para Facebook Conversion API
// Este endpoint maneja el envío de eventos a Facebook de forma segura
// El CONVERSION_API_TOKEN nunca se expone al cliente

import https from 'https';

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*'); // En producción, cambia * por tu dominio
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    // Solo permitir POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        const { eventName, eventData, userData } = req.body;
        
        // Validar datos requeridos
        if (!eventName) {
            return res.status(400).json({ 
                success: false,
                error: 'eventName is required' 
            });
        }
        
        const pixelId = process.env.FACEBOOK_PIXEL_ID;
        const accessToken = process.env.FACEBOOK_CONVERSION_API_TOKEN;
        
        // Validar que las credenciales existan
        if (!pixelId || !accessToken) {
            return res.status(500).json({ 
                success: false,
                error: 'Facebook credentials not configured' 
            });
        }
        
        // Obtener IP del cliente
        const clientIp = req.headers['x-forwarded-for'] || 
                        req.headers['x-real-ip'] || 
                        req.connection?.remoteAddress || '';
        
        // Preparar datos del evento para Conversion API
        const eventPayload = {
            data: [{
                event_name: eventName,
                event_time: Math.floor(Date.now() / 1000),
                event_id: `${eventName}_${Date.now()}`,
                event_source_url: userData?.source_url || '',
                action_source: 'website',
                user_data: {
                    client_ip_address: clientIp.split(',')[0].trim(),
                    client_user_agent: req.headers['user-agent'] || '',
                    fbp: userData?.fbp || '',
                    fbc: userData?.fbc || ''
                },
                custom_data: eventData || {}
            }]
        };
        
        // Enviar a Facebook Conversion API usando https nativo de Node
        const postData = JSON.stringify(eventPayload);
        
        const options = {
            hostname: 'graph.facebook.com',
            port: 443,
            path: `/v18.0/${pixelId}/events?access_token=${accessToken}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };
        
        return new Promise((resolve) => {
            const request = https.request(options, (response) => {
                let data = '';
                
                response.on('data', (chunk) => {
                    data += chunk;
                });
                
                response.on('end', () => {
                    try {
                        const jsonData = JSON.parse(data);
                        if (response.statusCode === 200) {
                            res.status(200).json({ 
                                success: true,
                                data: jsonData
                            });
                        } else {
                            res.status(response.statusCode).json({ 
                                success: false,
                                error: jsonData.error?.message || 'Error sending event to Facebook'
                            });
                        }
                    } catch (e) {
                        res.status(500).json({ 
                            success: false,
                            error: 'Error parsing response'
                        });
                    }
                    resolve();
                });
            });
            
            request.on('error', (error) => {
                res.status(500).json({ 
                    success: false,
                    error: 'Network error'
                });
                resolve();
            });
            
            request.write(postData);
            request.end();
        });
        
    } catch (error) {
        return res.status(500).json({ 
            success: false,
            error: 'Internal server error'
        });
    }
}

