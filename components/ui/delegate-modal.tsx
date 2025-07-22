import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from 'react-hot-toast';
import { Label } from "@/components/ui/label"
import { DialogFooter } from "@/components/ui/dialog"
import Web3 from 'web3';

interface DelegateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelegate: (amount: string) => void;
  nodeName: string;
  isLoading: boolean;
  checkSufficientBalance: (amount: string) => Promise<boolean>;
}

export const DelegateModal = ({
  isOpen,
  onClose,
  onDelegate,
  nodeName,
  isLoading,
  checkSufficientBalance
}: DelegateModalProps) => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const value = amount.trim();
    if (!value || isNaN(Number(value)) || Number(value) <= 0) {
      setError('请输入有效的委托金额');
      return;
    }

    try {
      const hasSufficientBalance = await checkSufficientBalance(value);
      if (!hasSufficientBalance) {
        setError('余额不足');
        return;
      }

      onDelegate(value);
      setAmount('');
      setError('');
    } catch (error) {
      setError('检查余额时出错');
      console.error(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>委托到节点: {nodeName}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="amount">委托金额 (LAT)</Label>
              <Input
                id="amount"
                type="text"
                pattern="[0-9]*\.?[0-9]*"
                value={amount}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || /^\d*\.?\d*$/.test(value)) {
                    setAmount(value);
                    setError('');
                  }
                }}
                disabled={isLoading}
                placeholder="请输入委托金额"
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              取消
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? '处理中...' : '确认'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

