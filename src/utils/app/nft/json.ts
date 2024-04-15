import { NFT_JSON_FILEEXT, NFT_JSON_PATH } from "../constants"
import { nftSigns } from './constants'

async function getNftSign() {
  const randomElement = nftSigns[Math.floor(Math.random() * nftSigns.length)];
  console.log('Random Sign: ',randomElement)
  return randomElement
}

export async function generateNftJson({address,username,avatarCID}:{
  address: string,
  username: string,
  avatarCID: string
}){

  // Build NFT JSON
  const randomSign = await getNftSign()
  const nftJSON = {
    "description": "MetaWarrior Army Membership",
    "external_url": "https://auth.metawarrior.army/nfts/"+address+".json",
    "image": "ipfs://"+avatarCID,
    "name": username.toLowerCase(),
    "attributes": [
      {
        "trait_type": "Publisher",
        "value":"https://www.metawarrior.army"
      },
      {
        "trait_type": "Season",
        "value": "Beta"
      },
      {
        "trait_type": "Operation",
        "value": "MWAOPRD0: Operation Campfire"

      },
      {
        "trait_type": "Membership Level",
        "value": "Beta"
      },
      {
        "trait_type":"Sign",
        "value": randomSign
      }
    ]
  }
  const nftJSONString = JSON.stringify(nftJSON)
  const nftFilePath = NFT_JSON_PATH+address+NFT_JSON_FILEEXT

  // Write NFT JSON to filesystem
  const fs = require('fs')
  try {
    fs.writeFileSync(nftFilePath,nftJSONString)
  }
  catch(e:any){
    console.log(e)
    return undefined
  }

  return nftFilePath
}