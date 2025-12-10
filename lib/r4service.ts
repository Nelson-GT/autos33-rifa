import crypto from 'crypto';

interface BcvResponse {
  code: string;
  fechavalor: string;
  tipocambio: number;
}

export const getTasaBCV = async (): Promise<BcvResponse | null> => {
  const endpoint = '/MBbcv';
  const url = `${process.env.R4_API_URL}${endpoint}`;
  
  const moneda = 'USD';
  const today = new Date();
  const fechaValor = today.toISOString().split('T')[0]; 

  const dataToSign = `${fechaValor}${moneda}`;
  const secretKey = process.env.R4_COMMERCE_TOKEN || '';

  const signature = crypto
    .createHmac('sha256', secretKey)
    .update(dataToSign)
    .digest('hex');

  const payload = {
    Moneda: moneda,
    Fechavalor: fechaValor
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': signature,
        'Commerce': secretKey
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data: BcvResponse = await response.json();
    return data;

  } catch (error) {
    console.error("Error consultando R4 BCV:", error);
    throw error;
  }
};