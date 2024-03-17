import { Injectable, OnModuleInit } from '@nestjs/common';
import { appConfig } from 'src/config/app.config';
import PinataSDK from '@pinata/sdk';
import { Address } from 'web3';

@Injectable()
export class IPFSService implements OnModuleInit {
  pinata: PinataSDK;

  onModuleInit() {
    const pinataSDK = require('@pinata/sdk');
    this.pinata = new pinataSDK(
      appConfig().pinataApiKey,
      appConfig().pinataApiSecret,
    );
  }

  async getCid(request: MintNftRequest) {
    const { IpfsHash } = await this.pinata.pinFileToIPFS(request.imageBytes);
    const { IpfsHash: result } = await this.pinata.pinJSONToIPFS({
      title: request.title,
      description: request.description,
      imageCid: IpfsHash,
    });
    return result;
  }
}

export interface MintNftRequest {
  title: string;
  description: string;
  to: Address;
  imageBytes: Buffer;
}
