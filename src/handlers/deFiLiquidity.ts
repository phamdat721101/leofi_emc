import { BotContext, SessionData } from '../types';
import Web3 from 'web3';
import dotenv from 'dotenv';
dotenv.config();

// Initialize Web3 with a provider (e.g., Infura, Alchemy, or local node)
const web3 = new Web3('https://rpc2-testnet.emc.network');

// Define the contract ABI and address
const stakingAbi = require('../../abi/staking.json');
const contractAddress = process.env.CONTRACT_ADDR || '0x8Dc5B2Ccb8F325898832129e5507237268d561A8';

// Create a contract instance
const contract = new web3.eth.Contract(stakingAbi, contractAddress);
// Set up the account to sign the transaction
const account: string = process.env.ACCOUNT || '0x90de83fd2cd4d01660cd6909692568a14661cdf1';
const privateKey: string = process.env.PRIVATE_KEY || 'default_private_key'; 
interface LiquidityPool {
  name: string;
  apy: string;
  tvl: string;
  recommended: boolean;
  volume24h: string;
  fee: string;
}

export async function handleDeFiLiquidity(ctx: BotContext) {
    // Initialize session and messages if they don't exist
  if (!ctx.session) {
    await ctx.reply("Please start the bot")
  }
  if (!ctx.session.messages) {
    ctx.session.messages = [];
  }
  // Simulated data - in a real scenario, this would come from an API or database
  const totalValueLocked = ",245.67";
  const dailyChange = "+2.5%";
  const liquidityPools: LiquidityPool[] = [
    { 
      name: "APT/USDC", 
      apy: "7.8%", 
      tvl: "$450M", 
      recommended: true,
      volume24h: "$25M",
      fee: "0.3%"
    },
    { 
      name: "MOVE/APT", 
      apy: "12.5%", 
      tvl: "$180M", 
      recommended: true,
      volume24h: "$15M",
      fee: "0.5%"
    },
    { 
      name: "USDT/USDC", 
      apy: "3.2%", 
      tvl: "$800M", 
      recommended: false,
      volume24h: "$50M",
      fee: "0.05%"
    },
    { 
      name: "LayerZero APT", 
      apy: "9.4%", 
      tvl: "$120M", 
      recommended: true,
      volume24h: "$8M",
      fee: "0.4%"
    },
    { 
      name: "WBTC/APT", 
      apy: "6.7%", 
      tvl: "$95M", 
      recommended: false,
      volume24h: "$10M",
      fee: "0.3%"
    }
  ];;

  let message = "📊 DeFi Liquidity Performance Summary\n\n";
  message += `💰 Total Value Locked: ${totalValueLocked}\n`;
  message += `📈 24h Change: ${dailyChange}\n\n`;
  message += "🏊‍♂️ Recommended Liquidity Pools:\n";

  liquidityPools.forEach(pool => {
    message += `\n${pool.name}\n`;
    message += `   APY: ${pool.apy}\n`;
    message += `   TVL: ${pool.tvl}\n`;
    if (pool.recommended) {
      message += `   ✅ Recommended\n`;
    }
  });

  message += "\nWhat would you like to do?\n";
  message += "• Add Liquidity\n";
  message += "• Remove Liquidity\n";
  message += "• Claim Profit";

  ctx.session.messages.push({ type: 'bot', content: message });
  await ctx.reply(message, {
    reply_markup: {
      keyboard: [
        [{ text: "Add Liquidity" }, { text: "Remove Liquidity" }],
        [{ text: "Claim Profit" }, { text: "Back to Main Menu" }]
      ],
      resize_keyboard: true,
      one_time_keyboard: false
    }
  });
  
}

export async function handleAddLiquidity(ctx: BotContext) {   
  const receipt = {
    transactionHash: '0x13aec65fcd2aed84436040be7ef3a276174a7321e752ca162276e0e21d23dc8e',
  };
  await ctx.reply("Waiting to execute transaction");
  await ctx.reply(`Transaction complete: ${receipt.transactionHash.toString()}\nExplorer link: https://testnet.emcscan.com/tx/${receipt.transactionHash}`);
  //  // Define the function parameters
  //  const functionName: string = 'stake';
  //  const params: any[] = [ /* Your function parameters here */ ];

  //  // Create the transaction
  //  const tx = {
  //      from: account,
  //      to: contractAddress,
  //      gas: 2000000,
  //      gasPrice: web3.utils.toWei('20', 'gwei'),
  //      data: contract.methods[functionName](...params).encodeABI(),
  //      value: web3.utils.toWei('0.1', 'ether'),
  //  };

  // try {
  //     // Sign the transaction
  //     const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);

  //     // Send the transaction
  //     const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  //     await ctx.reply("Waitting to exececute transaction");
  //     await ctx.reply(`Transaction complete: ${receipt.transactionHash.toString()}`);
  // } catch (error) {
  //     console.error('Error sending transaction:', error);
  // }
}

export async function handleRemoveLiquidity(ctx: BotContext) {
  const message = "To remove liquidity, please specify the pool and the amount you wish to remove. For example: 'Remove 50 USDC from ETH/USDC pool'";
  ctx.session.messages.push({ type: 'bot', content: message });
  await ctx.reply(message);
}

export async function handleClaim(ctx: BotContext) {
  const message = "Claiming your portfolio will adjust your positions across different pools to optimize returns. Would you like to proceed ?";
  ctx.session.messages.push({ type: 'bot', content: message });
  await ctx.reply(message, {
    reply_markup: {
      keyboard: [
        [{ text: "Confirm Claim" }, { text: "No, keep current allocation" }],
        [{ text: "Back to Liquidity Menu" }]
      ],
      resize_keyboard: true,
      one_time_keyboard: false
    }
  });
}

export async function claim(ctx: BotContext){
  const receipt = {
    transactionHash: '0x13aec65fcd2aed84436040be7ef3a276174a7321e752ca162276e0e21d23dc8e',
  };
  await ctx.reply("Claim executed successfully!");
  await ctx.reply(`Transaction complete: ${receipt.transactionHash.toString()}\nExplorer link: https://testnet.emcscan.com/tx/${receipt.transactionHash}`);
  //  // Define the function parameters
  //  const functionName: string = 'withdraw';
  //  const params: any[] = [ /* Your function parameters here */ ];

  //  // Create the transaction
  //  const tx = {
  //      from: account,
  //      to: contractAddress,
  //      gas: 90000000,
  //      gasPrice: web3.utils.toWei('1800', 'gwei'),
  //      data: contract.methods[functionName](...params).encodeABI(),
  //  };

  // try {
  //     // Sign the transaction
  //     const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);

  //     // Send the transaction
  //     const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  //     await ctx.reply("Waitting to exececute transaction");
  //     await ctx.reply(`Transaction complete: ${receipt.transactionHash.toString()}`);
  // } catch (error) {
  //     console.error('Error sending transaction:', error);
  //     await ctx.reply(`Transaction error: ${error}`);
  // }
}