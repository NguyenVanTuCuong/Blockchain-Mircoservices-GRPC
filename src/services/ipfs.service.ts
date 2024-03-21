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
      orchidId: request.orchidId,
      name: request.name,
      description: request.description,
      imageCid: IpfsHash,
      color : request.color,
      createAt: new Date(request.createdAt),
      updatedAt: new Date(request.updatedAt),
      origin : request.origin,
      species : request.species
    }, {
      pinataMetadata: {
        name: randomUUID()
      }
    });
    return result;
  }
}

export interface MintNftRequest {
  orchidId: string;
  name: string;
  description: string;
  to: Address;
  imageBytes: Buffer;
  color: string;
	species: string;
	origin: string;
	createdAt: number;
	updatedAt: number;
}

export interface BurnNftRequest {
  tokenId: number;
}
