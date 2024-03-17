export const appConfig = () => ({
  mnemonic: process.env.MNEMONIC,
  privateKey: process.env.PRIVATE_KEY,
  nft: process.env.NFT,
  factory: process.env.FACTORY,
  pinataApiKey: process.env.PINATA_API_KEY,
  pinataApiSecret: process.env.PINATA_API_SECRET
});
