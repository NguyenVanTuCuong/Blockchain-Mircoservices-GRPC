import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from './config/app.config';
import { WalletService } from './services/wallet.service';
import { IPFSService } from './services/ipfs.service';
import { NftContractService } from './services/nft/nft-contract.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: [appConfig],
  }),

  ],
  controllers: [AppController],
  providers: [AppService, WalletService, IPFSService, NftContractService],
})
export class AppModule {}
