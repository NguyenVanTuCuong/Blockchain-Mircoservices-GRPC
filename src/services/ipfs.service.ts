import { Injectable, OnModuleInit } from '@nestjs/common';
import { appConfig } from 'src/config/app.config';
import PinataSDK from '@pinata/sdk';
import { Address } from 'web3';
import { randomUUID } from 'crypto';
import { Readable } from 'stream';

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
    console.log(request)
    const { IpfsHash } = await this.pinata.pinFileToIPFS(
      Readable.from(request.imageBytes)
      , {
      pinataMetadata: {
        name: randomUUID()
      }
    });
    const { IpfsHash: result } = await this.pinata.pinJSONToIPFS({
      name: request.name,
      description: request.description,
      imageCid: IpfsHash,
    }, {
      pinataMetadata: {
        name: randomUUID()
      }
    });
    return result;
  }
}

export interface MintNftRequest {
  name: string;
  description: string;
  to: Address;
  imageBytes: Buffer;
}

export interface BurnNftRequest {
  tokenId: string;
}
