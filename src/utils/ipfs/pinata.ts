import { NFT_IMAGE_FILEEXT, NFT_JSON_FILEEXT, PINATA_JWT } from "@/utils/app/constants"

// Upload Avatar PNG file to Pinata
export async function uploadAvatarPinata({avatarFilePath,address}:{
  avatarFilePath: string,
  address: string,
}) {

  // Prepare pinata
  const pinataSDK = require('@pinata/sdk')
  const pinata = await new pinataSDK({ pinataJWTKey: PINATA_JWT})
  
  // Open file
  const fs = require('fs')
  const avatarstream = fs.createReadStream(avatarFilePath)

  // Set pinOpts
  const pinOpts = {
    pinataMetadata: {
        name: address+NFT_IMAGE_FILEEXT,
    },
    pinataOptions: {
        cidVersion: 0
    },
  }
  
  // Pin file
  const uploadRes = await pinata.pinFileToIPFS(avatarstream,pinOpts)
  if(!uploadRes) return undefined

  // Return result
  return uploadRes.IpfsHash
}


// Upload NFT JSON File to Pinata
export async function uploadNFTPinata({nftFilePath,address}:{
  nftFilePath: string,
  address: string,
}) {
  
  // Open NFT JSON file
  const fs = require('fs')
  const nftstream = fs.createReadStream(nftFilePath)

  // Set pinOpts
  const pinOpts = {
    pinataMetadata: {
        name: address+NFT_JSON_FILEEXT,
    },
    pinataOptions: {
        cidVersion: 0
    },
  }
  
  // Pin file - Upload to Pinata
  const pinataSDK = require('@pinata/sdk')
  const pinata = await new pinataSDK({ pinataJWTKey: PINATA_JWT})

  // Pin file
  const uploadNftRes = await pinata.pinFileToIPFS(nftstream,pinOpts)
  if(!uploadNftRes) return undefined

  // Return result
  return uploadNftRes.IpfsHash
}

export async function unpinCID(CID:string) {
  const pinataSDK = require('@pinata/sdk')
  const pinata = await new pinataSDK({ pinataJWTKey: PINATA_JWT})
  // unpin
  const res = await pinata.unpin(CID)
  console.log('Unpin result:')
  console.log(res)
  if(res !== 'OK') return undefined
  return true
}