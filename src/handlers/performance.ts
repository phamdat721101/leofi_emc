import { BotContext } from '../types';

export async function handlePerformance(ctx: BotContext) {
  const performanceSummary = 'Here\'s a summary of pools performance:';
  
  // Updated performance table to include pools, yield, and pairs
  const performanceTable = `
\`\`\`
| Pool Name | Pair         | Yield (%) | Amount     | Value (USD) |
|-----------|--------------|-----------|------------|-------------|
| Dogecoin  | DOGE/USDT    | 12.5      | 10,000     | $720        |
| Shiba Inu | SHIB/ETH     | 8.0       | 5,000,000  | $450        |
| Pepe      | PEPE/USDC    | 15.0      | 1,000,000  | $320        |
| Bonk      | BONK/USDT    | 5.0       | 10,000,000 | $180        |
| Ethereum   | ETH/USDC     | 3.5       | 0.5        | $1,000      |
| USDC      | USDC/DAI     | 0.0       | 1,000      | $1,000      |
| Total     |              |           |            | $3,670      |
\`\`\``;

  const dashboardLink = 'For detailed performance tracking, please visit our dashboard: [📊 View Dashboard](https://www.leofi.xyz/)';
  
  const message = `${performanceSummary}\n\n${performanceTable}\n\n${dashboardLink}`;
  
  ctx.session.messages.push({ type: 'bot', content: message });
  await ctx.reply(message, { parse_mode: 'Markdown' });
}
