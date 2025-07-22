import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DialogFooter } from "@/components/ui/dialog"

interface WithdrawDelegateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWithdraw: (amount: string) => void;
  nodeName: string;
  nodeId: string;
  isLoading: boolean;
  maxAmount: string;
  delegation?: any;
  darkMode?: boolean;
}

export function WithdrawDelegateModal({
  isOpen,
  onClose,
  onWithdraw,
  nodeName,
  nodeId,
  isLoading,
  maxAmount,
  delegation,
  darkMode = false
}: WithdrawDelegateModalProps) {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError('请输入有效的减持金额');
      return;
    }

    const totalAmount = Number(maxAmount);
    const reduceAmount = Number(amount);

    if (reduceAmount > totalAmount) {
      setError('减持金额不能大于总可减持金额');
      return;
    }

    // 如果减持的金额包含锁定部分，显示提示信息
    const unlockedAmount = Number(delegation?.delegateHas || 0);
    if (reduceAmount > unlockedAmount) {
      const willBeFrozen = Math.min(reduceAmount - unlockedAmount, Number(delegation?.delegateLocked || 0));
      const confirmReduce = window.confirm(
        `减持的 ${willBeFrozen} LAT 将被冻结约 168 天，是否继续？`
      );
      
      if (!confirmReduce) {
        return;
      }
    }

    try {
      onWithdraw(amount);
      setAmount('');
      setError('');
      onClose();
    } catch (error) {
      setError('减持失败，请重试');
    }
  };

  const dialogContentClass = darkMode 
    ? "sm:max-w-[425px] bg-gray-900 text-white border-gray-700"
    : "sm:max-w-[425px]";

  const descriptionClass = darkMode
    ? "text-gray-300"
    : "text-gray-500";

  const labelClass = darkMode 
    ? "text-gray-300" 
    : "";

  const nodeDetailsClass = darkMode
    ? "text-sm text-gray-300"
    : "text-sm text-gray-500";

  const nodeIdClass = darkMode
    ? "text-xs text-gray-400"
    : "text-xs text-gray-400";

  const amountDetailsClass = darkMode
    ? "text-sm text-gray-400"
    : "text-sm text-gray-500";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={dialogContentClass}>
        <DialogHeader>
          <DialogTitle className={darkMode ? "text-white" : ""}>减持委托</DialogTitle>
          <DialogDescription className={descriptionClass}>
            请输入要减持的 LAT 数量
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label className={labelClass}>节点名称</Label>
              <div className={nodeDetailsClass}>{nodeName}</div>
              <div className={nodeIdClass}>
                {nodeId.slice(0, 6)}...{nodeId.slice(-4)}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount" className={labelClass}>减持数量 (LAT)</Label>
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
                placeholder="请输入减持金额"
                className={darkMode ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-500" : ""}
              />
              <div className={amountDetailsClass}>
                <div>总可减持金额: {maxAmount} LAT</div>
                <div>未锁定金额: {delegation?.delegateHas || '0'} LAT</div>
                <div>已锁定金额: {delegation?.delegateLocked || '0'} LAT</div>
                <div className="text-yellow-500">
                  注意：减持已锁定的金额将进入冻结期，预计解冻时间约为 ？天
                </div>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose} 
              disabled={isLoading}
              className={darkMode ? "border-gray-700 text-white hover:bg-gray-800 bg-gray-900" : ""}
            >
              取消
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className={darkMode ? "bg-white text-black hover:bg-gray-200" : ""}
            >
              {isLoading ? '处理中...' : '确认'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 