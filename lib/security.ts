import { headers } from 'next/headers';

const ALLOWED_IPS = [
  '45.175.213.98', 
  '200.74.203.91', 
  '204.199.249.3'
];

export function verifyBankIP(): boolean {
  const headersList = headers();
  const forwardedFor = headersList.get('x-forwarded-for');
  if (!forwardedFor) {
    return false; 
  }
  const requestIP = forwardedFor.split(',')[0].trim();
  return ALLOWED_IPS.includes(requestIP);
}