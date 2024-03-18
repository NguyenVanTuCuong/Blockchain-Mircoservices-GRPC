import { Injectable, OnModuleInit } from '@nestjs/common';
import { appConfig } from 'src/config/app.config';
import Web3, { Contract } from 'web3';
import abi from './abi';
import { IPFSService, MintNftRequest } from '../ipfs.service';
import { WalletService } from '../wallet.service';
import { getHttpWeb3 } from 'src/providers';
import { Web3Account } from "web3-eth-accounts"
import { GrpcMethod } from '@nestjs/microservices';

@Injectable()
export class NftContractService implements OnModuleInit {
  contract: Contract<typeof abi>
  account: Web3Account

  constructor(private readonly ipfsService: IPFSService, private readonly walletService: WalletService) {
  }

  async onModuleInit() {
    const web3 = getHttpWeb3()
    this.contract = new web3.eth.Contract(abi, appConfig().nft, web3)
    this.account = web3.eth.accounts.privateKeyToAccount(appConfig().privateKey)
  }

  @GrpcMethod("NftService", "MintNft")
  async mintNft(request: MintNftRequest) {
    const cid = await this.ipfsService.getCid(request)
    console.log(cid)
    const data = this.contract.methods.mint(request.to , cid).encodeABI()
    var transaction = await this.account.signTransaction({
      from: this.account.address,
      data,
      gasPrice: GAS_PRICE,
      gasLimit: GAS_LIMIT
    })
    return {
      transactionHash: transaction.transactionHash
    }
  }
}

export const GAS_PRICE = Web3.utils.toWei(25, "gwei")
export const GAS_LIMIT = "30000000"
