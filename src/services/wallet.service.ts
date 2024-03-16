import { Injectable, OnModuleInit } from '@nestjs/common';
import { HDKey } from "ethereum-cryptography/hdkey.js"
import { appConfig } from 'src/config/app.config';
import { mnemonicToSeed } from "bip39"

@Injectable()
export class WalletService implements OnModuleInit {
    hdKey: HDKey

    async onModuleInit() {
        const seed = await mnemonicToSeed(appConfig().mnemonic)
        this.hdKey = HDKey.fromMasterSeed(seed)
        console.log(this.hdKey)
    }
}
