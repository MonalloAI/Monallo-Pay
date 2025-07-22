import axios from 'axios';
import RLP from 'rlp';
import { bufferToHex, privateToAddress } from 'ethereumjs-util';
import BN from 'bn.js';
import BigInteger from 'big-integer';
import Common from 'ethereumjs-common';
import EthereumTx from 'ethereumjs-tx';
import { toBech32Address } from '@/app/utils/platonUtils';

const paramsOrder = {
  '1000': ['typ', 'benefitAddress', 'nodeId', 'externalId', 'nodeName', 'website', 'details', 'amount', 'rewardPer', 'programVersion', 'programVersionSign', 'blsPubKey', 'blsProof'],
  '1001': ['benefitAddress', 'nodeId', 'rewardPer', 'externalId', 'nodeName', 'website', 'details'],
  '1002': ['nodeId', 'typ', 'amount'],
  '1003': ['nodeId'],
  '1004': ['typ', 'nodeId', 'amount'],
  '1005': ['stakingBlockNum', 'nodeId', 'amount'],
  '1006': [],
  '1100': [],
  '1101': [],
  '1102': [],
  '1103': ['addr'],
  '1104': ['stakingBlockNum', 'delAddr', 'nodeId'],
  '1105': ['nodeId'],
  '1106': ['delAddr'],
  '1200': [],
  '1201': [],
  '1202': [],
  '2000': ['verifier', 'pIDID'],
  '2001': ['verifier', 'pIDID', 'newVersion', 'endVotingRounds'],
  '2002': ['verifier', 'pIDID', 'module', 'name', 'newValue'],
  '2005': ['verifier', 'pIDID', 'endVotingRounds', 'tobeCanceledProposalID'],
  '2003': ['verifier', 'proposalID', 'option', 'programVersion', 'versionSign'],
  '2004': ['verifier', 'programVersion', 'versionSign'],
  '2100': ['proposalID'],
  '2101': ['proposalID'],
  '2102': [],
  '2103': [],
  '2104': ['module', 'name'],
  '2105': ['proposalID', 'blockHash'],
  '2106': ['module'],
  '3000': ['typ', 'data'],
  '3001': ['typ', 'addr', 'blockNumber'],
  '4000': ['account', 'plan'],
  '4100': ['account'],
  '5000': [],
  '5100': ['address', 'nodeIDs'],
};

interface PPOSSettings {
  provider?: any;
  chainId?: number;
  privateKey?: string;
  gas?: string;
  gasPrice?: string;
  hrp?: string;
}

export class PPOS {
  private provider: any;
  private client: any;
  private chainId?: number;
  private privateKey?: string;
  private gas?: string;
  private gasPrice?: string;
  private hrp: string;

  constructor(setting: PPOSSettings) {
    if (setting.provider) {
      this.provider = setting.provider;
      console.log('Provider URL:', this.provider);
      this.client = axios.create({ baseURL: setting.provider });
    }
    this.chainId = setting.chainId;
    this.privateKey = setting.privateKey?.toLowerCase().startsWith('0x') ? setting.privateKey.substring(2) : setting.privateKey;
    this.gas = setting.gas;
    this.gasPrice = setting.gasPrice;
    this.hrp = setting.hrp || "imua";
  }

  updateSetting(setting: PPOSSettings) {
    if (setting.provider) {
      this.provider = setting.provider;
      this.client = axios.create({ baseURL: setting.provider });
    }
    this.chainId = setting.chainId;
    this.privateKey = setting.privateKey?.toLowerCase().startsWith('0x') ? setting.privateKey.substring(2) : setting.privateKey;
    this.gas = setting.gas;
    this.gasPrice = setting.gasPrice;
    this.hrp = setting.hrp || "imua";
  }

  async rpc(method: string, params: any[] = []) {
    try {
      const data = { "jsonrpc": "2.0", "method": method, "params": params, "id": new Date().getTime() };
      const replay = await this.client.post("", data);
      if (replay.status === 200) {
        if (replay.data.result === undefined && replay.data.error !== undefined) {
          return Promise.reject(replay.data.error);
        } else {
          return Promise.resolve(replay.data.result);
        }
      } else {
        return Promise.reject("request error");
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async call(params: any) {
    try {
      const rawTx: any = {};
      params = this.objToParams(params);
      rawTx.data = this.paramsToData(params);
      rawTx.to = this.funcTypeToBech32(this.hrp, params[0]);
      const data = await this.rpc("platon_call", [rawTx, "latest"]);
      return Promise.resolve(this.pposHexToObj(data));
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private objToParams(params: any) {
    if (!Array.isArray(params)) {
      const pars = [params.funcType];
      const order = paramsOrder[params.funcType];
      for (const key of order) {
        pars.push(params[key]);
      }
      return pars;
    }
    return params;
  }

  private paramsToData(params: any) {
    const arr = [];
    for (const param of params) {
      console.log('Encoding param:', param);
      if (param instanceof Uint8Array) {
        const buffer = Buffer.from(param);
        console.log('Buffer from Uint8Array:', buffer);
        arr.push(RLP.encode(buffer).toString('hex'));
      } else {
        arr.push(RLP.encode(param).toString('hex'));
      }
    }
    return '0x' + RLP.encode(arr).toString('hex');
  }

  private funcTypeToBech32(hrp: string, funcType: number) {
    if (funcType >= 1000 && funcType < 2000) return toBech32Address(hrp, '0x1000000000000000000000000000000000000002');
    if (funcType >= 2000 && funcType < 3000) return toBech32Address(hrp, '0x1000000000000000000000000000000000000005');
    if (funcType >= 3000 && funcType < 4000) return toBech32Address(hrp, '0x1000000000000000000000000000000000000004');
    if (funcType >= 4000 && funcType < 5000) return toBech32Address(hrp, '0x1000000000000000000000000000000000000001');
    if (funcType >= 5000 && funcType < 6000) return toBech32Address(hrp, '0x1000000000000000000000000000000000000006');
  }

  private pposHexToObj(hexStr: string) {
    hexStr = hexStr.toLowerCase().startsWith('0x') ? hexStr.substring(2) : hexStr;
    let str = Buffer.from(hexStr, 'hex').toString();
    try {
      str = JSON.parse(str);
      if (typeof str.Data === 'string') {
        try {
          str.Data = JSON.parse(str.Data);
        } catch (error) { }
      }
    } catch (error) { }
    return str;
  }

  async callDelegationInfo(accountAddress: string) {
    try {
      const funcType = 1103; // 方法类型码
      const addr = Buffer.from(accountAddress.replace(/^0x/, ''), 'hex'); // 将地址转换为 Buffer

      const params = [funcType, addr];
      const rawTx: any = {};
      rawTx.data = this.paramsToData(params);
      rawTx.to = this.funcTypeToBech32(this.hrp, funcType);
      const data = await this.rpc("platon_call", [rawTx, "latest"]);
      return Promise.resolve(this.pposHexToObj(data));
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

export default PPOS; 