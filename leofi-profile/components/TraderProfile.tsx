'use client'

declare global {
  interface Window {
    ethereum: {
      request: (args: { 
        method: any,
        params: any
       }) => Promise<any>;
    };
  }
}

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { ethers } from 'ethers'
import { motion } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Switch } from "./ui/switch"
import { Slider } from "./ui/slider"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Progress } from "./ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Award, BarChart2, DollarSign, TrendingUp, Users, Wallet, ArrowRightLeft, ExternalLink, RefreshCw, Percent, Globe } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import tokenizeAbi from '../abi/tokenize.json'
import Web3 from 'web3';
import { EventEmitter } from 'events';

export default function TraderProfile() {  
  const [account, setAccount] = useState<string | null>(null)
  const [balance, setBalance] = useState<string | null>(null)
  const [isFollowing, setIsFollowing] = useState(false)
  const [fromToken, setFromToken] = useState('EMC')
  const [toToken, setToToken] = useState('USDC')
  const [fromAmount, setFromAmount] = useState('')
  const [toAmount, setToAmount] = useState('')
  const [exchangeRate, setExchangeRate] = useState(1800)
  const [selectedToken, setSelectedToken] = useState('EMC')
  const [tradeType, setTradeType] = useState('buy')
  const [amount, setAmount] = useState('')
  const [showCrossChainPopup, setShowCrossChainPopup] = useState(false)
  const [selectedChain, setSelectedChain] = useState('Aptos')

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  }

  const slideIn = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.5 } }
  }

  const monthlyPerformance = [
    { month: 'January', value: 1.8 },
    { month: 'February', value: -0.5 },
    { month: 'March', value: 2.3 },
    { month: 'April', value: 1.2 },
    { month: 'May', value: -0.8 },
    { month: 'June', value: 1.5 },
  ]

  useEffect(() => {
    handleCompound()
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        // Request connection to MetaMask wallet
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts',
          params: []
        });
        
        if (accounts.length > 0) {
          // Set the connected account address
          setAccount(accounts[0]);
          
          // Get the account balance
          const balanceHex = await window.ethereum.request({
            method: 'eth_getBalance',
            params: [accounts[0], 'latest']
          });
          const balance = parseFloat(balanceHex) / Math.pow(10, 18); // Convert Wei to Ether
          setBalance(balance.toString());
        }
      } catch (error) {
        console.error('Failed to connect wallet:', error);
      }
    } else {
      console.log('Please install MetaMask!');
    }   
  }

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
    // Implement follow logic here
    console.log(isFollowing ? 'Unfollowed' : 'Followed')
  }

  const handleCompound = async () => {
    console.log("Start to compound")
    
    // Ensure the wallet is connected
    if (!account) {
      await connectWallet(); // Call to connect MetaMask if not connected
    }

    const contractAddress = "0xB9aCc98206Bf46373072c2351dbeE748c542DE3d"; // EVM contract address    
    const web3 = new Web3(window.ethereum); // Initialize Web3
    const accounts = await web3.eth.getAccounts(); // Get accounts
    const contract = new web3.eth.Contract(tokenizeAbi, contractAddress); // Create contract instance    
    console.log("Contract: ", contract)
    try {
        const valueInEther = web3.utils.toWei("0.1", "ether"); // Convert to Wei
        const tx = await contract.methods.stake().send({
            from: accounts[0],
            value: valueInEther // Send value as ETH
        });
        alert(`Transaction successful: ${tx.transactionHash}`);
    } catch (error) {
        console.error('Transaction failed:', error);
    }
  }

  const handleTrade = async () => {

    const contractAddress = "0xB9aCc98206Bf46373072c2351dbeE748c542DE3d"; // EVM contract address    
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, tokenizeAbi, signer);

    try {
        const tx = await contract.claim({
          gasLimit: 810000,
          gasPrice: ethers.parseUnits('100', 'gwei')
        });
        await tx.wait(); // Wait for the transaction to be mined
        alert(`Transaction successful: ${tx.hash}`);
    } catch (error) {
        console.error('Transaction failed:', error);
    }
  }

  const handleCrossChainSwap = async (e: React.FormEvent) => {
    console.log(`Initiating cross-chain swap to ${selectedChain}`)
    // Here you would typically initiate the cross-chain swap process

    console.log(`${tradeType.toUpperCase()} ${amount} ${selectedToken}`)
    // Implement actual trading logic here   
    alert('Transaction successfully')
    setShowCrossChainPopup(false)
  }

  const recommendedTokens = ['EMC', 'LEO'];

  // Mock data for the trading chart
  const tradingChartData = [
    { time: '09:00', price: 3000 },
    { time: '10:00', price: 3050 },
    { time: '11:00', price: 3025 },
    { time: '12:00', price: 3075 },
    { time: '13:00', price: 3100 },
    { time: '14:00', price: 3090 },
    { time: '15:00', price: 3110 },
  ]

  const [tradingHistory, setTradingHistory] = useState<Array<{
    date: string;
    token: string;
    type: string;
    amount: string;
    price: string;
    txHash: string;
  }>>([
    { date: '2023-10-01', token: 'XAU', type: 'Buy', amount: '100', price: '$10.50', txHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef' },
    { date: '2023-09-28', token: 'OIL', type: 'Sell', amount: '0.5', price: '$27,000', txHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890' },
    { date: '2023-09-25', token: 'XAG', type: 'Buy', amount: '2', price: '$1,600', txHash: '0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba' },
  ])

  const [compoundAmount, setCompoundAmount] = useState<number>(1000) // Assuming $1000 profit for demonstration
  const [compoundToken, setCompoundToken] = useState<string>('APT')
  const [compoundMethod, setCompoundMethod] = useState<string>('stake')
  const [autoCompound, setAutoCompound] = useState<boolean>(false)
  const [compoundFrequency, setCompoundFrequency] = useState<number>(7) // days  

  return (
    <div className="container mx-auto p-4">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="w-full max-w-4xl mx-auto bg-card rounded-lg shadow-lg overflow-hidden"
      >
        <CardHeader className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between w-full">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LeoFi_4x4-qV8iHK5K8IxONkFo4Fe4Hwu9AwMHf0.jpg"
              alt="LeoFi Logo"
              width={100}
              height={100}
              className="h-12 w-auto"
            />
            <div className="flex items-center space-x-2">
              <Button
                variant={isFollowing ? "secondary" : "default"}
                onClick={handleFollow}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </Button>
              {account ? (
                <div className="flex items-center space-x-2">
                  <Wallet className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-600">{`${account.slice(0, 6)}...${account.slice(-4)}`}</span>
                </div>
              ) : (
                <Button variant="outline" onClick={connectWallet}>
                  <Wallet className="mr-2 h-4 w-4" /> Connect Wallet
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <motion.div variants={slideIn} className="p-6 flex flex-col sm:flex-row items-center gap-4">
          <Avatar className="w-24 h-24">
            <AvatarImage src="./leofi_logo.jpg" alt="Alex Morgan" />
            <AvatarFallback>AM</AvatarFallback>
          </Avatar>
          <div className="text-center sm:text-left">
            <CardTitle className="text-2xl font-bold">Alex Morgan</CardTitle>
            <CardDescription>Senior Fund Manager at LeoFi Investments</CardDescription>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
              <Badge variant="secondary">Forex</Badge>
              <Badge variant="secondary">Commodities</Badge>
              <Badge variant="secondary">Crypto</Badge>
            </div>
          </div>
        </motion.div>

        <CardContent>
          <Tabs defaultValue="performance" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="trading">Invest</TabsTrigger>
              <TabsTrigger value="compound">Compound</TabsTrigger>
            </TabsList>
            <TabsContent value="performance">
              <motion.div variants={fadeIn} className="grid gap-4 mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">AUM</CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">$1.2B</div>
                      <p className="text-xs text-muted-foreground">+20% from last year</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">YTD Return</CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">5.5%</div>
                      <p className="text-xs text-muted-foreground">+2.1% above benchmark</p>
                    </CardContent>
                  </Card>
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {monthlyPerformance.map((month, index) => (
                        <motion.div
                          key={month.month}
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                          <div className="flex items-center">
                            <span className="flex-1">{month.month}</span>
                            <span className="mr-4 text-right">{month.value > 0 ? '+' : ''}{month.value.toFixed(1)}%</span>
                            <Progress value={(month.value + 3) * 10} className="w-1/3" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
            <TabsContent value="trading">
              <motion.div variants={fadeIn} className="mt-4 grid gap-4">
              <Card>
                  <CardHeader>
                    <CardTitle>Trading</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Price Chart</h3>
                        <div className="w-full h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={tradingChartData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="time" />
                              <YAxis />
                              <Tooltip />
                              <Line type="monotone" dataKey="price" stroke="#8884d8" />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Trade</h3>
                        <form className="space-y-4">
                          <div>
                            <Label htmlFor="token">asset</Label>
                            <Select value={selectedToken} onValueChange={setSelectedToken}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select token" />
                              </SelectTrigger>
                              <SelectContent>
                                {recommendedTokens.map((token) => (
                                  <SelectItem key={token} value={token}>{token}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>                          
                          <div>
                            <Label htmlFor="amount">Amount</Label>
                            <Input
                              id="amount"
                              type="number"
                              placeholder="Enter amount"
                              value={amount}
                              onChange={(e) => setAmount(e.target.value)}
                            />
                          </div>                          
                        </form>
                        <div className="mt-6">
                          <Button onClick={handleTrade} className="w-full">
                            <ArrowRightLeft className="mr-2 h-4 w-4" /> 
                              Invest {selectedToken}
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6">
                      <h3 className="font-semibold mb-2">Recommended Assets:</h3>
                      <div className="flex flex-wrap gap-2">
                        {recommendedTokens.map((token) => (
                          <Badge key={token} variant="secondary">{token}</Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Asset</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tradingHistory.map((trade, index) => (
                          <TableRow key={index}>
                            <TableCell>{trade.date}</TableCell>
                            <TableCell>{trade.token}</TableCell>
                            <TableCell>{trade.type}</TableCell>
                            <TableCell>{trade.amount}</TableCell>
                            <TableCell>{trade.price}</TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(`https://testnet.emcscan.com/tx/0x8af4f1dc740c6ab9a787c5f45ba6f8f9fdcb32fac3cb3d1bc3bcd380c07725a7`, '_blank')}
                              >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>          
            <TabsContent value="compound">
              <motion.div variants={fadeIn} className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Compound Your Profits</CardTitle>
                    <CardDescription>Grow your investments by reinvesting your profits</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="manual" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="manual">Manual Compound</TabsTrigger>
                        <TabsTrigger value="auto">Auto-Compound</TabsTrigger>
                      </TabsList>
                      <TabsContent value="manual">
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="compound-amount">Amount to Compound</Label>
                            <Input
                              id="compound-amount"
                              type="number"
                              value={compoundAmount}
                              onChange={(e) => setCompoundAmount(Number(e.target.value))}
                              max={1000} // Assuming $1000 profit for demonstration
                            />
                          </div>
                          <div>
                            <Label htmlFor="compound-token">Select Token</Label>
                            <Select value={compoundToken} onValueChange={setCompoundToken}>
                              <SelectTrigger id="compound-token">
                                <SelectValue placeholder="Select token" />
                              </SelectTrigger>
                              <SelectContent>
                                {recommendedTokens.map((token) => (
                                  <SelectItem key={token} value={token}>{token}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="compound-method">Compound Method</Label>
                            <Select value={compoundMethod} onValueChange={setCompoundMethod}>
                              <SelectTrigger id="compound-method">
                                <SelectValue placeholder="Select method" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="stake">Stake</SelectItem>
                                <SelectItem value="farm">Farm</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="auto">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="auto-compound">Enable Auto-Compound</Label>
                            <Switch
                              id="auto-compound"
                              checked={autoCompound}
                              onCheckedChange={setAutoCompound}
                            />
                          </div>
                          {autoCompound && (
                            <div>
                              <Label htmlFor="compound-frequency">Compound Frequency (days)</Label>
                              <div className="flex items-center space-x-2">
                                <Slider
                                  id="compound-frequency"
                                  min={1}
                                  max={30}
                                  step={1}
                                  value={[compoundFrequency]}
                                  onValueChange={(value) => setCompoundFrequency(value[0])}
                                />
                                <span>{compoundFrequency} days</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleCompound} className="w-full">
                      {autoCompound ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Set Auto-Compound
                        </>
                      ) : (
                        <>
                          <ArrowRightLeft className="mr-2 h-4 w-4" />
                          Compound Now
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
                <div className="mt-4 text-center text-sm text-gray-500">
                  <p>Estimated Annual Yield: <span className="font-bold text-green-600">12%</span></p>
                  <p>Compound Effect: <span className="font-bold text-green-600">+2.3%</span> <Percent className="inline h-4 w-4 text-green-600" /></p>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="flex justify-between p-6 border-t">
          <div className="flex items-center">
            <Award className="h-5 w-5 text-yellow-500 mr-2" />
            <span className="text-sm text-muted-foreground">Top 1% performer in 2023</span>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <BarChart2 className="mr-2 h-4 w-4" /> View Full Analytics
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Full Analytics - Alex Morgan</DialogTitle>
                <DialogDescription>
                  Comprehensive performance metrics and analysis
                </DialogDescription>
              </DialogHeader>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                className="mt-4 space-y-4"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Metric</TableHead>
                          <TableHead>1 Year</TableHead>
                          <TableHead>3 Year</TableHead>
                          <TableHead>5 Year</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>Total Return</TableCell>
                          <TableCell>11.2%</TableCell>
                          <TableCell>32.7%</TableCell>
                          <TableCell>58.9%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Alpha</TableCell>
                          <TableCell>2.8%</TableCell>
                          <TableCell>2.5%</TableCell>
                          <TableCell>2.3%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Sharpe Ratio</TableCell>
                          <TableCell>1.4</TableCell>
                          <TableCell>1.3</TableCell>
                          <TableCell>1.2</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Max Drawdown</TableCell>
                          <TableCell>-8.2%</TableCell>
                          <TableCell>-12.5%</TableCell>
                          <TableCell>-15.3%</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Asset Allocation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {[
                        { name: 'Equities', value: 45 },
                        { name: 'Fixed Income', value: 30 },
                        { name: 'Commodities', value: 15 },
                        { name: 'Crypto', value: 10 },
                      ].map((asset, index) => (
                        <motion.div
                          key={asset.name}
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                          <div className="flex items-center">
                            <span className="flex-1">{asset.name}</span>
                            <span className="mr-4 text-right">{asset.value}%</span>
                            <Progress value={asset.value} className="w-1/3" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </DialogContent>
          </Dialog>
          <Dialog open={showCrossChainPopup} onOpenChange={setShowCrossChainPopup}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Globe className="mr-2 h-4 w-4" /> Cross-Chain
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cross-Chain Opportunities</DialogTitle>
                <DialogDescription>
                  Explore and execute cross-chain swaps and investments
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="chain-select">Select Target Chain</Label>
                  <Select value={selectedChain} onValueChange={setSelectedChain}>
                    <SelectTrigger id="chain-select">
                      <SelectValue placeholder="Select chain" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ethereum">Ethereum</SelectItem>
                      <SelectItem value="Binance Smart Chain">Binance Smart Chain</SelectItem>
                      <SelectItem value="Solana">Solana</SelectItem>
                      <SelectItem value="Polygon">Polygon</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="cross-chain-amount">Amount</Label>
                  <Input
                    id="cross-chain-amount"
                    type="number"
                    placeholder="Enter amount"
                  />
                </div>
                <div>
                  <Label htmlFor="cross-chain-token">Token</Label>
                  <Select>
                    <SelectTrigger id="cross-chain-token">
                      <SelectValue placeholder="Select token" />
                    </SelectTrigger>
                    <SelectContent>
                      {recommendedTokens.map((token) => (
                        <SelectItem key={token} value={token}>{token}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleCrossChainSwap} className="w-full">
                  <ArrowRightLeft className="mr-2 h-4 w-4" />
                  Initiate Cross-Chain Swap
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </motion.div>
    </div>
  )
}