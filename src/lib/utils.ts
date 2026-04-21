import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number) {
  return new Intl.NumberFormat('en-US').format(num);
}

export function extractInstagramHandle(input: string): string {
  // Removes http, https, www, instagram.com, trailing slashes, and '@'
  let clean = input.trim();
  
  if (clean.includes('instagram.com/')) {
    const parts = clean.split('instagram.com/');
    const handlePart = parts[1].split('/')[0].split('?')[0];
    return handlePart.replace('@', '');
  }
  
  return clean.replace('@', '').split('/')[0].split('?')[0];
}

export function getInstagramChatUrl(handle: string): string {
  return `https://www.instagram.com/direct/t/${handle}/`;
}

export function getInstagramProfileUrl(handle: string): string {
  return `https://www.instagram.com/${handle}/`;
}
