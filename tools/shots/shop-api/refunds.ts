// Refunds of an order, asked by its buyer and approved by its seller.
export interface Refund { order: string; amount: number; state: 'asked' | 'approved' | 'paid' }

export function ask(order: string, amount: number): Refund {
  return { order, amount, state: 'asked' };
}
