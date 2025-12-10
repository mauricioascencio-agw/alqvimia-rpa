// 🤖 MÓDULO DE INTEGRACIÓN CON PROVEEDORES DE IA/OCR

const AIProviders = {
    // Analizar documento con el proveedor configurado
    async analyzeDocument(fileData, fileName) {
        const config = AIConfigManager.getConfig();

        if (!config) {
            throw new Error('No hay configuración de IA. Por favor configura un proveedor primero.');
        }

        const provider = config.provider;

        switch (provider) {
            case 'claude':
                return await this.analyzeWithClaude(fileData, fileName, config.config);
            case 'openai':
                return await this.analyzeWithOpenAI(fileData, fileName, config.config);
            case 'google':
                return await this.analyzeWithGoogleVision(fileData, fileName, config.config);
            case 'azure':
                return await this.analyzeWithAzure(fileData, fileName, config.config);
            case 'tesseract':
                return await this.analyzeWithTesseract(fileData, fileName, config.config);
            default:
                throw new Error(`Proveedor no soportado: ${provider}`);
        }
    },

    // Análisis con Claude (Anthropic)
    async analyzeWithClaude(fileData, fileName, config) {
        const apiKey = config.apiKey;
        const model = config.model || 'claude-3-5-sonnet-20241022';
        const maxTokens = parseInt(config.maxTokens) || 4096;

        // Convertir archivo a base64 si es necesario
        const base64Data = await this.fileToBase64(fileData);
        const mediaType = this.getMediaType(fileName);

        const prompt = `Analiza este documento y extrae todos los campos estructurados que encuentres.

Para cada campo detectado, proporciona:
1. name: nombre técnico del campo (sin espacios, en snake_case)
2. label: etiqueta legible del campo
3. type: tipo de dato (text, number, date, email, phone, etc.)
4. value: valor detectado en el documento
5. confidence: nivel de confianza de 0 a 1

Devuelve SOLO un JSON válido con esta estructura:
{
    "documentType": "tipo de documento detectado",
    "fields": [
        {
            "name": "campo_1",
            "label": "Campo 1",
            "type": "text",
            "value": "valor",
            "confidence": 0.95
        }
    ]
}`;

        try {
            const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01'
                },
                body: JSON.stringify({
                    model: model,
                    max_tokens: maxTokens,
                    messages: [
                        {
                            role: 'user',
                            content: [
                                {
                                    type: 'image',
                                    source: {
                                        type: 'base64',
                                        media_type: mediaType,
                                        data: base64Data
                                    }
                                },
                                {
                                    type: 'text',
                                    text: prompt
                                }
                            ]
                        }
                    ]
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(`Claude API Error: ${error.error?.message || response.statusText}`);
            }

            const result = await response.json();
            const content = result.content[0].text;

            // Extraer JSON del contenido
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('No se pudo extraer JSON de la respuesta de Claude');
            }

            const extracted = JSON.parse(jsonMatch[0]);

            return {
                documentType: extracted.documentType || 'Documento',
                fields: extracted.fields || [],
                confidence: this.calculateAverageConfidence(extracted.fields),
                provider: 'claude',
                model: model
            };
        } catch (error) {
            console.error('Error en Claude API:', error);
            throw error;
        }
    },

    // Análisis con OpenAI GPT-4 Vision
    async analyzeWithOpenAI(fileData, fileName, config) {
        const apiKey = config.apiKey;
        const model = config.model || 'gpt-4o';
        const maxTokens = parseInt(config.maxTokens) || 4096;

        const base64Data = await this.fileToBase64(fileData);
        const mediaType = this.getMediaType(fileName);

        const prompt = `Analiza este documento y extrae todos los campos estructurados.

Devuelve SOLO un JSON válido con esta estructura:
{
    "documentType": "tipo de documento",
    "fields": [
        {
            "name": "campo_nombre",
            "label": "Campo Nombre",
            "type": "text",
            "value": "valor",
            "confidence": 0.95
        }
    ]
}`;

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: model,
                    max_tokens: maxTokens,
                    messages: [
                        {
                            role: 'user',
                            content: [
                                {
                                    type: 'text',
                                    text: prompt
                                },
                                {
                                    type: 'image_url',
                                    image_url: {
                                        url: `data:${mediaType};base64,${base64Data}`
                                    }
                                }
                            ]
                        }
                    ]
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(`OpenAI API Error: ${error.error?.message || response.statusText}`);
            }

            const result = await response.json();
            const content = result.choices[0].message.content;

            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('No se pudo extraer JSON de la respuesta de OpenAI');
            }

            const extracted = JSON.parse(jsonMatch[0]);

            return {
                documentType: extracted.documentType || 'Documento',
                fields: extracted.fields || [],
                confidence: this.calculateAverageConfidence(extracted.fields),
                provider: 'openai',
                model: model
            };
        } catch (error) {
            console.error('Error en OpenAI API:', error);
            throw error;
        }
    },

    // Análisis con Google Cloud Vision
    async analyzeWithGoogleVision(fileData, fileName, config) {
        const apiKey = config.apiKey;
        const base64Data = await this.fileToBase64(fileData);

        try {
            const response = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    requests: [
                        {
                            image: {
                                content: base64Data
                            },
                            features: [
                                { type: 'DOCUMENT_TEXT_DETECTION' },
                                { type: 'TEXT_DETECTION' }
                            ]
                        }
                    ]
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(`Google Vision API Error: ${error.error?.message || response.statusText}`);
            }

            const result = await response.json();
            const fullText = result.responses[0]?.fullTextAnnotation?.text || '';

            // Procesar texto y extraer campos comunes
            const fields = this.extractFieldsFromText(fullText);

            return {
                documentType: 'Documento',
                fields: fields,
                confidence: this.calculateAverageConfidence(fields),
                provider: 'google',
                rawText: fullText
            };
        } catch (error) {
            console.error('Error en Google Vision API:', error);
            throw error;
        }
    },

    // Análisis con Azure Document Intelligence
    async analyzeWithAzure(fileData, fileName, config) {
        const endpoint = config.endpoint;
        const apiKey = config.apiKey;
        const model = config.model || 'prebuilt-document';

        const base64Data = await this.fileToBase64(fileData);

        try {
            // Paso 1: Enviar documento para análisis
            const analyzeUrl = `${endpoint}/formrecognizer/documentModels/${model}:analyze?api-version=2023-07-31`;

            const analyzeResponse = await fetch(analyzeUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Ocp-Apim-Subscription-Key': apiKey
                },
                body: JSON.stringify({
                    base64Source: base64Data
                })
            });

            if (!analyzeResponse.ok) {
                const error = await analyzeResponse.json();
                throw new Error(`Azure API Error: ${error.error?.message || analyzeResponse.statusText}`);
            }

            // Paso 2: Obtener URL de resultados
            const operationLocation = analyzeResponse.headers.get('Operation-Location');

            // Paso 3: Poll resultados
            let resultData = null;
            for (let i = 0; i < 30; i++) {
                await this.sleep(1000);

                const resultResponse = await fetch(operationLocation, {
                    headers: {
                        'Ocp-Apim-Subscription-Key': apiKey
                    }
                });

                const result = await resultResponse.json();

                if (result.status === 'succeeded') {
                    resultData = result;
                    break;
                } else if (result.status === 'failed') {
                    throw new Error('Azure document analysis failed');
                }
            }

            if (!resultData) {
                throw new Error('Timeout esperando resultados de Azure');
            }

            // Extraer campos del resultado
            const fields = this.extractAzureFields(resultData);

            return {
                documentType: resultData.analyzeResult?.docType || 'Documento',
                fields: fields,
                confidence: this.calculateAverageConfidence(fields),
                provider: 'azure',
                model: model
            };
        } catch (error) {
            console.error('Error en Azure API:', error);
            throw error;
        }
    },

    // Análisis con Tesseract.js (local)
    async analyzeWithTesseract(fileData, fileName, config) {
        // Verificar si Tesseract está cargado
        if (typeof Tesseract === 'undefined') {
            // Cargar Tesseract.js dinámicamente
            await this.loadTesseract();
        }

        const language = config.language || 'spa';

        try {
            const worker = await Tesseract.createWorker(language);

            const { data } = await worker.recognize(fileData);
            const fullText = data.text;

            await worker.terminate();

            // Extraer campos del texto
            const fields = this.extractFieldsFromText(fullText);

            return {
                documentType: 'Documento',
                fields: fields,
                confidence: this.calculateAverageConfidence(fields),
                provider: 'tesseract',
                rawText: fullText
            };
        } catch (error) {
            console.error('Error en Tesseract:', error);
            throw error;
        }
    },

    // Cargar Tesseract.js dinámicamente
    async loadTesseract() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@4/dist/tesseract.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    },

    // Extraer campos del texto usando patrones
    extractFieldsFromText(text) {
        const fields = [];

        // Patrones comunes en documentos fiscales mexicanos
        const patterns = [
            {
                pattern: /(?:RFC|R\.F\.C\.?)[:\s]*([A-ZÑ&]{3,4}\d{6}[A-Z\d]{3})/i,
                name: 'rfc',
                label: 'RFC',
                type: 'text'
            },
            {
                pattern: /(?:Folio|Factura|Invoice|No\.?)[:\s#]*([A-Z0-9\-]+)/i,
                name: 'invoice_number',
                label: 'Número de Factura',
                type: 'text'
            },
            {
                pattern: /(?:Fecha|Date)[:\s]*(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})/i,
                name: 'date',
                label: 'Fecha',
                type: 'date'
            },
            {
                pattern: /(?:Total|Importe Total|Amount)[:\s]*\$?\s*([\d,]+\.?\d*)/i,
                name: 'total_amount',
                label: 'Monto Total',
                type: 'number'
            },
            {
                pattern: /(?:Subtotal)[:\s]*\$?\s*([\d,]+\.?\d*)/i,
                name: 'subtotal',
                label: 'Subtotal',
                type: 'number'
            },
            {
                pattern: /(?:IVA)[:\s]*\$?\s*([\d,]+\.?\d*)/i,
                name: 'iva',
                label: 'IVA',
                type: 'number'
            },
            {
                pattern: /(?:UUID|Folio Fiscal)[:\s]*([A-F0-9\-]{36})/i,
                name: 'uuid',
                label: 'UUID',
                type: 'text'
            }
        ];

        patterns.forEach(({ pattern, name, label, type }) => {
            const match = text.match(pattern);
            if (match && match[1]) {
                fields.push({
                    name: name,
                    label: label,
                    type: type,
                    value: match[1].trim(),
                    confidence: 0.85 // Confianza estimada para regex
                });
            }
        });

        return fields;
    },

    // Extraer campos de resultados de Azure
    extractAzureFields(resultData) {
        const fields = [];

        if (resultData.analyzeResult?.documents) {
            resultData.analyzeResult.documents.forEach(doc => {
                if (doc.fields) {
                    Object.keys(doc.fields).forEach(key => {
                        const field = doc.fields[key];
                        fields.push({
                            name: key.toLowerCase().replace(/\s+/g, '_'),
                            label: key,
                            type: this.mapAzureFieldType(field.type),
                            value: field.content || field.valueString || field.valueNumber || '',
                            confidence: field.confidence || 0.8
                        });
                    });
                }
            });
        }

        return fields;
    },

    // Mapear tipos de campo de Azure a tipos estándar
    mapAzureFieldType(azureType) {
        const typeMap = {
            'string': 'text',
            'number': 'number',
            'date': 'date',
            'time': 'time',
            'phoneNumber': 'phone',
            'array': 'text',
            'object': 'text'
        };

        return typeMap[azureType] || 'text';
    },

    // Convertir archivo a base64
    async fileToBase64(fileData) {
        if (typeof fileData === 'string' && fileData.startsWith('data:')) {
            // Ya es base64
            return fileData.split(',')[1];
        }

        if (fileData instanceof File || fileData instanceof Blob) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    const base64 = reader.result.split(',')[1];
                    resolve(base64);
                };
                reader.onerror = reject;
                reader.readAsDataURL(fileData);
            });
        }

        throw new Error('Formato de archivo no soportado');
    },

    // Obtener media type del archivo
    getMediaType(fileName) {
        const ext = fileName.split('.').pop().toLowerCase();

        const mediaTypes = {
            'pdf': 'application/pdf',
            'png': 'image/png',
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'gif': 'image/gif',
            'webp': 'image/webp'
        };

        return mediaTypes[ext] || 'application/octet-stream';
    },

    // Calcular confianza promedio
    calculateAverageConfidence(fields) {
        if (!fields || fields.length === 0) return 0;

        const sum = fields.reduce((acc, field) => acc + (field.confidence || 0), 0);
        return sum / fields.length;
    },

    // Sleep helper
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};
