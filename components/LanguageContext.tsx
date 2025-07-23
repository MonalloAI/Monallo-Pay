'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'zh';

type TranslationDictionary = {
  [key: string]: {
    en: string;
    zh: string;
  };
};

const translations: TranslationDictionary = {
  // Errors
  errors: {
    en: {
      // Add error messages in English
      general: 'An error occurred',
      network: 'Network error',
      transaction_failed: 'Transaction failed',
      invalid_amount: 'Invalid amount',
      invalid_address: 'Invalid address',
      insufficient_funds: 'Insufficient funds',
      user_rejected: 'User rejected the request',
      unknown: 'Unknown error',
      install_metamask: 'Please install MetaMask!',
      connect_metamask_error: 'Error connecting to MetaMask:',
      empty_address: 'Address cannot be empty',
      invalid_imua_address: 'Invalid IMUA address format',
      invalid_address_length: 'Invalid address length',
      invalid_address_format: 'Invalid address format',
      insufficient_balance: 'Insufficient balance',
      transaction_creation_failed: 'Transaction creation failed',
      contract_address_not_configured: '{{asset}} contract address not configured',
      balance_update_failed: 'Token transfer successful, but balance update failed:',
      copy_text_failed: 'Failed to copy text:',
      copy_failed: 'Unable to copy address to clipboard',
    },
    zh: {
      // Add error messages in Chinese
      general: '发生错误',
      network: '网络错误',
      transaction_failed: '交易失败',
      invalid_amount: '金额无效',
      invalid_address: '地址无效',
      insufficient_funds: '余额不足',
      user_rejected: '用户拒绝请求',
      unknown: '未知错误',
      install_metamask: '请安装MetaMask!',
      connect_metamask_error: '连接MetaMask时出错:',
      empty_address: '地址不能为空',
      invalid_imua_address: 'IMUA地址格式无效',
      invalid_address_length: '地址长度无效',
      invalid_address_format: '地址格式无效',
      insufficient_balance: '余额不足',
      transaction_creation_failed: '交易创建失败',
      contract_address_not_configured: '{{asset}}合约地址未配置',
      balance_update_failed: '代币转账成功，但余额更新失败:',
      copy_text_failed: '复制文本失败:',
      copy_failed: '无法复制地址到剪贴板',
    },
  },
  
  // Messages
  messages: {
    en: {
      address_copied: 'Address copied to clipboard',
      token_transfer_success: 'Token transfer successful!',
      maoeurc_coming_soon: 'maoEURC is coming soon, stay tuned!',
    },
    zh: {
      address_copied: '地址已复制到剪贴板',
      token_transfer_success: '代币转账成功!',
      maoeurc_coming_soon: 'maoEURC正在接入中，敬请期待！',
    },
  },
  
  // Tabs
  'tabs.assets': {
    en: 'Assets',
    zh: '资产',
  },
  'tabs.transfer': {
    en: 'Transfer',
    zh: '转账',
  },
  'tabs.transaction_records': {
    en: 'Records',
    zh: '交易记录',
  },
  'tabs.contacts': {
    en: 'Contacts',
    zh: '联系人',
  },
  // App general
  'app.title': {
    en: 'Welcome to MonalloPay',
    zh: '欢迎使用 MonalloPay',
  },
  
  // Wallet
  'wallet.connect': {
    en: 'Connect Wallet',
    zh: '连接钱包',
  },
  'wallet.connecting': {
    en: 'Connecting...',
    zh: '连接中...',
  },
  'wallet.connect.description': {
    en: 'Connect your wallet to get started',
    zh: '连接您的钱包以开始使用',
  },
  'wallet.login': {
    en: 'Login with MetaMask',
    zh: '登录MetaMask',
  },
  'wallet.title': {
    en: 'Wallet',
    zh: '钱包',
  },
  'wallet.address': {
    en: 'Address',
    zh: '地址',
  },
  'wallet.account_info': {
    en: 'Account Info',
    zh: '账户信息',
  },
  'wallet.logout': {
    en: 'Logout',
    zh: '退出',
  },
  
  // Assets
  'assets.total': {
    en: 'Total Assets Value ($)',
    zh: '总资产估值($)',
  },
  'assets.name': {
    en: 'Asset Name',
    zh: '资产名称',
  },
  'assets.balance': {
    en: 'Balance',
    zh: '余额',
  },
  'assets.network': {
    en: 'Imuachain',
    zh: 'Imuachain',
  },
  'assets.login_description': {
    en: 'Login with MetaMask to deposit and manage assets',
    zh: '登录 MetaMask 可以存入和管理资产',
  },
  
  // Actions
  'action.deposit': {
    en: 'Deposit',
    zh: '充值',
  },
  'action.receive': {
    en: 'Receive',
    zh: '收款',
  },
  'action.transfer': {
    en: 'Transfer',
    zh: '转账',
  },
  
  // Transfer
  'transfer.title': {
    en: 'Transfer',
    zh: '转账',
  },
  'transfer.asset': {
    en: 'Asset',
    zh: '资产',
  },
  'transfer.balance': {
    en: 'Balance',
    zh: '余额',
  },
  'transfer.select.asset': {
    en: 'Select Asset',
    zh: '选择资产',
  },
  'transfer.amount.placeholder': {
    en: 'Enter transfer amount',
    zh: '请输入转账数额',
  },
  'transfer.address.placeholder': {
    en: 'Enter public address (0x) or domain',
    zh: '请输入公共地址（0x）或域名',
  },
  'transfer.processing': {
    en: 'Processing...',
    zh: '转账中...',
  },
  'transfer.coming.soon': {
    en: 'maoEURC is coming soon!',
    zh: 'maoEURC正在接入中，敬请期待！',
  },
  'transfer.insufficient.balance': {
    en: 'Insufficient balance',
    zh: '余额不足',
  },
  
  // Transactions
  'transactions.title': {
    en: 'Transaction Records',
    zh: '交易记录',
  },
  'transactions.empty': {
    en: 'No transaction records',
    zh: '当前没有交易记录',
  },
  'transactions.loading': {
    en: 'Loading transaction records...',
    zh: '正在加载交易记录...',
  },
  'transactions.search': {
    en: 'Search transactions...',
    zh: '搜索交易...',
  },
  'transactions.select.currency': {
    en: 'Select Currency',
    zh: '选择币种',
  },
  'transactions.all.currencies': {
    en: 'All Currencies',
    zh: '所有币种',
  },
  'transactions.transaction': {
    en: 'Transaction',
    zh: '交易',
  },
  'transactions.success': {
    en: 'Success ✓',
    zh: '成功 ✓',
  },
  'transactions.sender': {
    en: 'Sender',
    zh: '发送方',
  },
  'transactions.recipient': {
    en: 'Recipient',
    zh: '接收方',
  },
  'transactions.hash': {
    en: 'Transaction Hash',
    zh: '交易哈希',
  },
  'transactions.page': {
    en: 'Page {current} of {total}',
    zh: '第 {current} 页，共 {total} 页',
  },
  'transactions.no.data': {
    en: 'No Data',
    zh: '暂无数据',
  },
  'transactions.sent': {
    en: 'Sent',
    zh: '转出',
  },
  'transactions.received': {
    en: 'Received',
    zh: '转入',
  },
  'transactions.sent.to': {
    en: 'Sent to',
    zh: '发送至',
  },
  'transactions.received.from': {
    en: 'Received from',
    zh: '接收自',
  },
  'transactions.time': {
    en: 'Time',
    zh: '时间',
  },
  
  // Contacts
  'contacts.title': {
    en: 'Contacts',
    zh: '联系人',
  },
  'contacts.addContact': {
    en: 'Add Contact',
    zh: '添加联系人',
  },
  'contacts.editContact': {
    en: 'Edit Contact',
    zh: '编辑联系人',
  },
  'contacts.deleteContact': {
    en: 'Delete Contact',
    zh: '删除联系人',
  },
  'contacts.contactName': {
    en: 'Contact Name',
    zh: '联系人名称',
  },
  'contacts.contactAddress': {
    en: 'Contact Address',
    zh: '联系人地址',
  },
  'contacts.noContacts': {
    en: 'No contacts added yet',
    zh: '尚未添加任何联系人',
  },
  'contacts.addNow': {
    en: 'Add Now',
    zh: '立即添加',
  },
  'contacts.deleteSuccess': {
    en: 'Delete Success',
    zh: '删除成功',
  },
  'contacts.contactDeleted': {
    en: 'Contact has been deleted',
    zh: '联系人已被删除',
  },
  'contacts.addressCopied': {
    en: 'Address copied to clipboard',
    zh: '地址已复制到剪贴板',
  },
  'contacts.confirmDelete': {
    en: 'Are you sure you want to delete contact "{name}"?',
    zh: '确定要删除联系人 "{name}" 吗？',
  },
  'contacts.errors.invalidAddress': {
    en: 'Please enter a valid 0x address or 64-bit hash address',
    zh: '请输入有效的0x开头地址或64位哈希地址',
  },
  'contacts.actions': {
    en: 'Actions',
    zh: '操作',
  },
  'contacts.edit': {
    en: 'Edit',
    zh: '编辑',
  },
  'contacts.delete': {
    en: 'Delete',
    zh: '删除',
  },
  'contacts.save': {
    en: 'Save',
    zh: '保存',
  },
  'contacts.cancel': {
    en: 'Cancel',
    zh: '取消',
  },
  'contacts.empty': {
    en: 'No contacts found',
    zh: '没有找到联系人',
  },
  'contacts.select_contact': {
    en: 'Select Contact',
    zh: '选择联系人',
  },
  'contacts.search_contacts': {
    en: 'Search contacts...',
    zh: '搜索联系人...',
  },
  
  // Settings
  'settings.title': {
    en: 'Settings',
    zh: '设置',
  },
  'settings.display.name': {
    en: 'Display Name',
    zh: '显示名称',
  },
  'settings.save': {
    en: 'Save',
    zh: '保存',
  },
  
  // QR Code
  'qr.code': {
    en: 'QR Code',
    zh: '二维码',
  },
  'qr.scan': {
    en: 'Scan to transfer',
    zh: '扫码转账',
  },
  'qrcode.generationFailed': {
    en: 'QR Code generation failed:',
    zh: 'QR Code 生成失败:',
  },
  'qrcode.addressCopied': {
    en: 'Address copied to clipboard!',
    zh: '地址已复制到剪贴板!',
  },
  'qrcode.saveQR': {
    en: 'Save QR',
    zh: '保存 QR',
  },
  
  // Common
  'common.add': {
    en: 'Add',
    zh: '添加',
  },
  'common.edit': {
    en: 'Edit',
    zh: '编辑',
  },
  'common.delete': {
    en: 'Delete',
    zh: '删除',
  },
  'common.copy': {
    en: 'Copy',
    zh: '复制',
  },
  'common.cancel': {
    en: 'Cancel',
    zh: '取消',
  },
  'common.confirm': {
    en: 'Confirm',
    zh: '确定',
  },
  'common.update': {
    en: 'Update',
    zh: '更新',
  },
  'common.copySuccess': {
    en: 'Copy Success',
    zh: '复制成功',
  },
  'common.copyFailed': {
    en: 'Copy failed:',
    zh: '复制失败:',
  },
  'common.loginRegister': {
    en: 'Login / Register',
    zh: '登录 / 注册',
  },
  'common.comingSoon': {
    en: 'Coming Soon',
    zh: '即将推出',
  },
  'common.featureInDevelopment': {
    en: 'This feature is under development, stay tuned!',
    zh: '这个功能正在开发中，敬请期待！',
  },

  // Errors
  'error.install.metamask': {
    en: 'Please install MetaMask!',
    zh: '请安装MetaMask!',
  },
  'error.connect.metamask': {
    en: 'Error connecting to MetaMask:',
    zh: '连接MetaMask时出错:',
  },
};

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // 从本地存储中获取语言设置，默认为英文
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('language') as Language;
      return savedLanguage === 'zh' ? 'zh' : 'en';
    }
    return 'en';
  });

  // 当语言变化时，保存到本地存储
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', language);
    }
  }, [language]);

  // 翻译函数
  const t = (key: string, params?: Record<string, string | number>): string => {
    const translation = translations[key];
    if (!translation) return key;

    let text = translation[language] || key;

    // 替换参数
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        text = text.replace(`{${paramKey}}`, String(paramValue));
      });
    }

    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}