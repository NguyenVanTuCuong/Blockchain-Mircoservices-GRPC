import { Injectable, OnModuleInit } from '@nestjs/common';
import { appConfig } from 'src/config/app.config';
import Web3, { Contract } from 'web3';
import abi from './abi';
import { BurnNftRequest, IPFSService, MintNftRequest } from '../ipfs.service';
import { WalletService } from '../wallet.service';
import { getHttpWeb3 } from 'src/providers';
import { Web3Account } from "web3-eth-accounts"
import { GrpcMethod } from '@nestjs/microservices';
import axios from 'axios';

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
    const data = this.contract.methods.mint(request.to, cid).encodeABI()
    var transaction = await this.account.signTransaction({
      from: this.account.address,
      to: appConfig().nft,
      data,
      gasPrice: GAS_PRICE,
      gasLimit: GAS_LIMIT,
    })
    const web3 = getHttpWeb3()
    const receipt = await web3.eth.sendSignedTransaction(transaction.rawTransaction)
    return {
      transactionHash: receipt.transactionHash
    }
  }

  @GrpcMethod("NftService", "BurnNft")
  async burnNft(request: BurnNftRequest) {
    console.log(request)
    const uri = await this.contract.methods._tokenURIs(request.tokenId).call()
    const _data = (await axios.get(`https://ipfs.io/ipfs/${uri}`)).data
    const orchidId = _data.orchidId

    const data = this.contract.methods.burn(request.tokenId).encodeABI()
    var transaction = await this.account.signTransaction({
      from: this.account.address,
      to: appConfig().nft,
      data,
      gasPrice: GAS_PRICE,
      gasLimit: GAS_LIMIT,
    })
    const web3 = getHttpWeb3()
    const receipt = await web3.eth.sendSignedTransaction(transaction.rawTransaction)
    return {
      orchidId,
      transactionHash: receipt.transactionHash
    }
  }
}

export const GAS_PRICE = Web3.utils.toWei(25, "gwei")
export const GAS_LIMIT = "3000000"
