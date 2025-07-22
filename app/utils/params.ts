import { RLP, utils } from "@ethereumjs/rlp";

export const getParam = (code: number, address: string, params: any[]) => {
  return {
    from: address,
    to: funcTypeToAddress(code),
    data: paramsToData([code, ...params]),
  };
};

export function funcTypeToAddress(funcType: number) {
  if (funcType >= 1000 && funcType < 2000)
    return "0x1000000000000000000000000000000000000002";
  if (funcType >= 2000 && funcType < 3000)
    return "0x1000000000000000000000000000000000000005";
  if (funcType >= 3000 && funcType < 4000)
    return "0x1000000000000000000000000000000000000004";
  if (funcType >= 4000 && funcType < 5000)
    return "0x1000000000000000000000000000000000000001";
  if (funcType >= 5000 && funcType < 6000)
    return "0x1000000000000000000000000000000000000006";
}

export function paramsToData(params: any[]) {
  let arr = [];
  for (let param of params) {
    arr.push("0x" + utils.bytesToHex(RLP.encode(param)));
  }
  let rlpData = "0x" + utils.bytesToHex(RLP.encode(arr));
  return rlpData;
}

export function decodeBlockLogs(block: any) {
  let logs = block.logs;
  if (Array.isArray(logs)) {
    for (let log of logs) {
      try {
        log.dataStr = JSON.parse(RLP.decode(log.data).toString());
      } catch (error) {}
    }
  }
}
