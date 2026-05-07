import type { CreditCard } from '@/lib/types';

const CARD_IMAGES: Array<{ match: RegExp; image: string }> = [
  {
    match: /apple/i,
    image: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=1200&h=760&fit=crop',
  },
  {
    match: /sapphire|chase/i,
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=760&fit=crop',
  },
];

export function getCardImage(card: CreditCard): string | undefined {
  if (card.image_url) return card.image_url;
  const key = `${card.card_name} ${card.issuer} ${card.network}`;
  return CARD_IMAGES.find((entry) => entry.match.test(key))?.image;
}

export function getCardSurface(card: CreditCard) {
  const key = `${card.card_name} ${card.issuer} ${card.network}`.toLowerCase();

  if (key.includes('apple')) {
    return {
      background: 'linear-gradient(145deg, #f7f7f4 0%, #e9e9e4 42%, #fbfbf8 100%)',
      accent: 'rgba(15,23,42,0.82)',
      subAccent: 'rgba(15,23,42,0.56)',
      label: 'Titanium',
    };
  }

  if (key.includes('gold')) {
    return {
      background: 'linear-gradient(145deg, #6f5316 0%, #cf9e2b 28%, #f4d68a 54%, #a9760e 100%)',
      accent: 'rgba(255,248,220,0.96)',
      subAccent: 'rgba(255,248,220,0.74)',
      label: 'Gold',
    };
  }

  if (key.includes('amex')) {
    return {
      background: 'linear-gradient(145deg, #4d6474 0%, #87a3b8 48%, #344a58 100%)',
      accent: 'rgba(255,255,255,0.96)',
      subAccent: 'rgba(255,255,255,0.74)',
      label: 'American Express',
    };
  }

  if (key.includes('venture') || key.includes('capital one')) {
    return {
      background: 'linear-gradient(145deg, #60191a 0%, #a62c2f 45%, #241315 100%)',
      accent: 'rgba(255,255,255,0.96)',
      subAccent: 'rgba(255,255,255,0.72)',
      label: 'Travel',
    };
  }

  return {
    background: `linear-gradient(145deg, ${card.color_from}, ${card.color_to})`,
    accent: 'rgba(255,255,255,0.96)',
    subAccent: 'rgba(255,255,255,0.72)',
    label: card.network || 'Card',
  };
}
