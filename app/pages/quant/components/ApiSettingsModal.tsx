'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from 'react-hot-toast'

interface ApiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveApi: (api: SavedApi) => void;
}

interface SavedApi {
  name: string;
  key: string;
  exchange: string;
}

export function ApiSettingsModal({ isOpen, onClose, onSaveApi }: ApiSettingsModalProps) {
  const [exchange, setExchange] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [secretKey, setSecretKey] = useState('')
  const [keyName, setKeyName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showError, setShowError] = useState(false)
  const [savedApis, setSavedApis] = useState<SavedApi[]>([])

  // 验证钱包地址格式
  const isValidAddress = (address: string) => {
    return /^0x[0-9a-fA-F]{40}$/.test(address);
  }

  // 验证私钥格式
  const isValidSecretKey = (key: string) => {
    return /^0x[0-9a-fA-F]{64}$/.test(key);
  }

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setApiKey(value);
    
    // 添加日志来调试
    console.log('Input value:', value);
    console.log('Exchange:', exchange);
    console.log('Is valid address:', /^0x[0-9a-fA-F]{40}$/.test(value));
    
    // 当输入完整的钱包地址时立即生成 API 密钥名称
    if (exchange && value.length === 42 && /^0x[0-9a-fA-F]{40}$/.test(value)) {
      const shortAddress = value.slice(-5);
      console.log('Generating key name:', `${exchange}-${shortAddress}`);
      setKeyName(`${exchange}-${shortAddress}`);
    }
  };

  const handleSecretKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSecretKey(e.target.value);
  };

  const handleExchangeChange = (value: string) => {
    setExchange(value);
    console.log('Exchange changed:', value);
    console.log('Current apiKey:', apiKey);
    
    // 如果已经有有效的钱包地址，更新 API 密钥名称
    if (apiKey.length === 42 && /^0x[0-9a-fA-F]{40}$/.test(apiKey)) {
      const shortAddress = apiKey.slice(-5);
      console.log('Updating key name:', `${value}-${shortAddress}`);
      setKeyName(`${value}-${shortAddress}`);
    }
  };

  const handleKeyNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyName(e.target.value);
  };

  const handleSubmit = async () => {
    // 表单验证
    if (!exchange || !apiKey || !secretKey) {
      toast.error('请填写所有必填字段');
      return;
    }

    // 验证钱包地址格式
    if (!isValidAddress(apiKey)) {
      toast.error('请输入正确格式的钱包地址');
      return;
    }

    // 验证私钥格式
    if (!isValidSecretKey(secretKey)) {
      toast.error('请输入正确格式的私钥');
      return;
    }

    setIsSubmitting(true);

    try {
      // 获取钱包地址
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      const walletAddress = accounts[0];

      // 发送数据到后端
      const response = await fetch('/api/trading/saveApiKeys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          exchange,
          apiKey,
          secretKey,
          keyName,
          walletAddress
        }),
      });

      const data = await response.json();

      if (data.success) {
        const newApi = {
          name: keyName,
          key: apiKey.slice(0, 6) + '*'.repeat(30) + apiKey.slice(-5),
          exchange: exchange
        };
        onSaveApi(newApi);
        toast.success('API密钥保存成功');
        resetForm();
        onClose();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('保存API密钥错误:', error);
      toast.error('保存失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 添加一个 useEffect 作为备份检查机制
  useEffect(() => {
    console.log('Effect triggered - exchange:', exchange, 'apiKey:', apiKey);
    if (exchange && apiKey.length === 42 && /^0x[0-9a-fA-F]{40}$/.test(apiKey)) {
      const shortAddress = apiKey.slice(-5);
      console.log('Effect generating key name:', `${exchange}-${shortAddress}`);
      setKeyName(`${exchange}-${shortAddress}`);
    }
  }, [exchange, apiKey]);

  // 添加重置表单的函数
  const resetForm = () => {
    setExchange('');
    setApiKey('');
    setSecretKey('');
    setKeyName('');
  };

  // 修改 Dialog 的 onOpenChange 处理
  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[600px] bg-gradient-to-l from-purple-50 to-[#FFFEFF]">
          <DialogHeader>
            <DialogTitle className="text-xl text-gray-800">设定交易所API</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* 推荐注册链接 */}
            <div className="bg-orange-500 p-4 rounded-lg">
              <p className="text-white">
                使用此推荐代码注册 Binance，即可获得10%佣金返还！
              </p>
              <a 
                href="https://accounts.binance.com/register?ref=DZN2FR0C" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white underline"
              >
                https://accounts.binance.com/register?ref=DZN2FR0C
              </a>
            </div>

            {/* 交易所选择 */}
            <div className="space-y-2">
              <label className="text-gray-700">交易所</label>
              <Select value={exchange} onValueChange={handleExchangeChange}>
                <SelectTrigger className="w-full bg-white border-gray-200">
                  <SelectValue placeholder="选择交易所" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HYPERLIQUID">HYPERLIQUID</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* API Key (钱包地址) */}
            <div className="space-y-2">
              <label className="text-gray-700">钱包地址</label>
              <Input 
                value={apiKey}
                onChange={handleApiKeyChange}
                placeholder="你的钱包地址" 
                className="bg-white border-gray-200 font-mono"
                maxLength={42}
              />
            </div>

            {/* API Secret Key */}
            <div className="space-y-2">
              <label className="text-gray-700">API secret key</label>
              <Input 
                value={secretKey}
                onChange={handleSecretKeyChange}
                placeholder="从您的交易所获取API secret key并填入" 
                className="bg-white border-gray-200 font-mono"
                maxLength={66}
              />
            </div>

            {/* API 密钥名称 - 可编辑 */}
            <div className="space-y-2">
              <label className="text-gray-700">API密钥名称</label>
              <Input 
                value={keyName}
                onChange={handleKeyNameChange}
                placeholder="为您的API密钥命名"
                className="bg-white border-gray-200"
              />
            </div>

            {/* 提交按钮 */}
            <div className="flex justify-center pt-4">
              <Button 
                className="bg-[#E4427D] hover:bg-[#E4427D]/90 text-white px-8"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? '提交中...' : '提交'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 错误提示弹窗 */}
      {showError && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
          <div className="bg-[#1A1F2D] p-8 rounded-lg w-[400px] text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full border-2 border-red-500 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
            </div>
            <h2 className="text-white text-xl mb-4">API密钥或API密码错误</h2>
            <Button 
              className="bg-[#E4427D] text-white px-8 py-2 rounded-lg hover:bg-[#E4427D]/90"
              onClick={() => setShowError(false)}
            >
              确认
            </Button>
          </div>
        </div>
      )}
    </>
  )
} 