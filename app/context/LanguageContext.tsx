'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'zh';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// 翻译字典
const translations: Record<Language, Record<string, string>> = {
  en: {
    // 通用
    'app.title': 'MonalloPay',
    'app.loading': 'Loading...',
    'app.error': 'Error',
    'app.success': 'Success',
    'app.cancel': 'Cancel',
    'app.confirm': 'Confirm',
    'app.save': 'Save',
    'app.edit': 'Edit',
    'app.delete': 'Delete',
    'app.back': 'Back',
    'app.next': 'Next',
    'app.submit': 'Submit',
    
    // 钱包连接
    'wallet.connect': 'Connect Wallet',
    'wallet.connecting': 'Connecting...',
    'wallet.connected': 'Connected',
    'wallet.disconnect': 'Disconnect',
    'wallet.address': 'Wallet Address',
    'wallet.copy': 'Copy Address',
    'wallet.copied': 'Address copied to clipboard',
    'wallet.view': 'View on Explorer',
    'wallet.install': 'Please install MetaMask!',
    
    // 资产页面
    'assets.title': 'Assets',
    'assets.total': 'Total Assets Value($)',
    'assets.name': 'Asset Name',
    'assets.balance': 'Balance',
    'assets.network': 'Imuachain',
    
    // 操作按钮
    'action.deposit': 'Deposit',
    'action.receive': 'Receive',
    'action.transfer': 'Transfer',
    'action.history': 'History',
    'action.contacts': 'Contacts',
    
    // 转账页面
    'transfer.title': 'Transfer',
    'transfer.asset': 'Asset',
    'transfer.amount': 'Amount',
    'transfer.recipient': 'Recipient',
    'transfer.address.placeholder': 'Enter public address (0x) or domain name',
    'transfer.amount.placeholder': 'Enter transfer amount',
    'transfer.balance': 'Balance',
    'transfer.processing': 'Processing...',
    'transfer.success': 'Transfer successful',
    'transfer.failed': 'Transfer failed',
    'transfer.select.asset': 'Select Asset',
    'transfer.coming.soon': 'Coming soon!',
    
    // 交易记录
    'transactions.title': 'Transaction Records',
    'transactions.empty': 'No transaction records',
    'transactions.date': 'Date',
    'transactions.type': 'Type',
    'transactions.amount': 'Amount',
    'transactions.status': 'Status',
    'transactions.from': 'From',
    'transactions.to': 'To',
    'transactions.hash': 'Transaction Hash',
    
    // 联系人
    'contacts.title': 'Contacts',
    'contacts.add': 'Add Contact',
    'contacts.edit': 'Edit Contact',
    'contacts.delete': 'Delete Contact',
    'contacts.name': 'Name',
    'contacts.address': 'Address',
    'contacts.empty': 'No contacts',
    'contacts.search': 'Search contacts',
    'contacts.select': 'Select Contact',
    
    // 设置
    'settings.title': 'Settings',
    'settings.language': 'Language',
    'settings.theme': 'Theme',
    'settings.notifications': 'Notifications',
    'settings.security': 'Security',
    'settings.display.name': 'Display Name',
    'settings.save': 'Save Settings',
    
    // QR码
    'qr.title.receive': 'Receive',
    'qr.title.deposit': 'Deposit',
    'qr.description': 'Scan this QR code to send funds',
    'qr.address': 'Address',
    
    // 错误信息
    'error.required': 'This field is required',
    'error.invalid.address': 'Invalid address',
    'error.insufficient.balance': 'Insufficient balance',
    'error.min.amount': 'Amount must be greater than 0',
    'error.max.amount': 'Amount exceeds your balance',
    'error.network': 'Network error, please try again',
    'error.transaction': 'Transaction failed',
  },
  zh: {
    // 通用
    'app.title': 'MonalloPay',
    'app.loading': '加载中...',
    'app.error': '错误',
    'app.success': '成功',
    'app.cancel': '取消',
    'app.confirm': '确认',
    'app.save': '保存',
    'app.edit': '编辑',
    'app.delete': '删除',
    'app.back': '返回',
    'app.next': '下一步',
    'app.submit': '提交',
    
    // 钱包连接
    'wallet.connect': '连接钱包',
    'wallet.connecting': '连接中...',
    'wallet.connected': '已连接',
    'wallet.disconnect': '断开连接',
    'wallet.address': '钱包地址',
    'wallet.copy': '复制地址',
    'wallet.copied': '地址已复制到剪贴板',
    'wallet.view': '在浏览器中查看',
    'wallet.install': '请安装MetaMask!',
    
    // 资产页面
    'assets.title': '资产',
    'assets.total': '总资产估值($)',
    'assets.name': '资产名称',
    'assets.balance': '余额',
    'assets.network': 'Imuachain',
    
    // 操作按钮
    'action.deposit': '充值',
    'action.receive': '收款',
    'action.transfer': '转账',
    'action.history': '历史',
    'action.contacts': '联系人',
    
    // 转账页面
    'transfer.title': '转账',
    'transfer.asset': '资产',
    'transfer.amount': '金额',
    'transfer.recipient': '收款人',
    'transfer.address.placeholder': '请输入公共地址（0x）或域名',
    'transfer.amount.placeholder': '请输入转账数额',
    'transfer.balance': '余额',
    'transfer.processing': '转账中...',
    'transfer.success': '转账成功',
    'transfer.failed': '转账失败',
    'transfer.select.asset': '选择资产',
    'transfer.coming.soon': '敬请期待！',
    
    // 交易记录
    'transactions.title': '交易记录',
    'transactions.empty': '暂无交易记录',
    'transactions.date': '日期',
    'transactions.type': '类型',
    'transactions.amount': '金额',
    'transactions.status': '状态',
    'transactions.from': '发送方',
    'transactions.to': '接收方',
    'transactions.hash': '交易哈希',
    
    // 联系人
    'contacts.title': '联系人',
    'contacts.add': '添加联系人',
    'contacts.edit': '编辑联系人',
    'contacts.delete': '删除联系人',
    'contacts.name': '姓名',
    'contacts.address': '地址',
    'contacts.empty': '暂无联系人',
    'contacts.search': '搜索联系人',
    'contacts.select': '选择联系人',
    
    // 设置
    'settings.title': '设置',
    'settings.language': '语言',
    'settings.theme': '主题',
    'settings.notifications': '通知',
    'settings.security': '安全',
    'settings.display.name': '显示名称',
    'settings.save': '保存设置',
    
    // QR码
    'qr.title.receive': '收款',
    'qr.title.deposit': '充值',
    'qr.description': '扫描此二维码发送资金',
    'qr.address': '地址',
    
    // 错误信息
    'error.required': '此字段为必填项',
    'error.invalid.address': '无效的地址',
    'error.insufficient.balance': '余额不足',
    'error.min.amount': '金额必须大于0',
    'error.max.amount': '金额超过您的余额',
    'error.network': '网络错误，请重试',
    'error.transaction': '交易失败',
  },
};

type LanguageProviderProps = {
  children: ReactNode;
};

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguage] = useState<Language>('en'); // 默认英文

  // 从本地存储加载语言设置
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'zh')) {
      setLanguage(savedLanguage);
    }
  }, []);

  // 保存语言设置到本地存储
  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  // 翻译函数
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// 自定义钩子，用于在组件中访问语言上下文
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};