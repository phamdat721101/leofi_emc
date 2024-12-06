import { Telegraf, session } from 'telegraf';
import { message } from 'telegraf/filters';
import { BotContext, Message } from './types';
import { handleYieldAssistant, handlePortfolio, addToPortfolio, handleMarketAnalysis, handlePerformance, handleOnboarding, handleMarketplace } from './handlers';
import { handleDeFiLiquidity, handleAddLiquidity, handleRemoveLiquidity, handleClaim, claim } from './handlers/deFiLiquidity';
import { ethers } from "ethers";
import dotenv from 'dotenv';
dotenv.config();

const bot = new Telegraf<BotContext>(process.env.BOT_TOKEN as string);

function generateEvmWallet() {
  // Generate a random wallet
  const wallet = ethers.Wallet.createRandom();

  // Extract details
  const privateKey = wallet.privateKey;
  const address = wallet.address;

  return {
      privateKey,
      address,
  };
}

bot.use(session({
  defaultSession: () => ({ messages: [], portfolio: [], awaitingPortfolioInput: false, wallet: {} })
}));

bot.command('start', (ctx) => {
  const wallet = generateEvmWallet();
  ctx.session = {
    messages: [
      { type: 'bot', content: 'Welcome to LeoFi! How can I assist you with your investments today?' }
    ],
    portfolio: [], // Add this line
    awaitingPortfolioInput: false,
    wallet: wallet
  };
  ctx.session.wallet = wallet
  ctx.reply(`Welcome to LeoFi! Your wallet address is ${wallet.address}. How can I assist you with your investments today?`, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'Top Portfolio', callback_data: 'top_portfolio' }, 
          { text: 'AI Sniper', callback_data: 'ai_sniper' }
        ],
        [
          { text: 'Pools', callback_data: 'pools' }, 
          { text: 'Earns', callback_data: 'earns' }
        ],
        [
          { text: 'Yield Assistant', callback_data: 'yield_assistant' }
        ]
      ]
    }
  });
});

bot.action('top_portfolio', handlePortfolio);
bot.action('ai_sniper', handleMarketAnalysis);
bot.action('pools', handlePerformance);
bot.action('earns', handleDeFiLiquidity);
bot.action('yield_assistant', handleYieldAssistant);

bot.hears('Add Liquidity', handleAddLiquidity);
bot.hears('Claim Profit', handleClaim)
bot.hears('Confirm Claim', claim)
// bot.hears('Remove Liquidity', handleRemoveLiquidity);
// bot.hears('Rebalance Portfolio', handleClaim);

bot.hears('Back to Main Menu', (ctx) => {
  ctx.reply('What would you like to do?', {
    reply_markup: {
      keyboard: [
        [{ text: 'Top Portfolio' }, { text: 'AI Sniper' }],
        [{ text: 'Performance' }, { text: 'DeFi Liquidity' }],
        [ { text: 'Yield Assistant' }]
      ],
      resize_keyboard: true,
      one_time_keyboard: false
    }
  });
});

bot.action('view_signals', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply('To view and copy signals, please visit our web app: https://www.leofi.xyz/');
});

bot.action('view_etfs', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply('To view and invest in ETFs, please visit our web app: https://www.leofi.xyz/');
});

bot.action('create_signal', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply('To create a new signal, please visit our web app: https://www.leofi.xyz/');
});

bot.action('create_etf', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply('To create a new ETF, please visit our web app: https://www.leofi.xyz/');
});

bot.on(message('text'), async (ctx) => {
  const userMessage: Message = { type: 'user', content: ctx.message.text };
  ctx.session.messages.push(userMessage);

  // Here you would typically process the message and generate a response
  // For this example, we'll just echo the message back
  const botResponse: Message = { type: 'bot', content: `You said: ${ctx.message.text}` };
  ctx.session.messages.push(botResponse);

  await ctx.reply(botResponse.content);
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));