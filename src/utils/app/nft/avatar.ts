import { NFT_AVATAR_PATH, NFT_IMAGE_FILEEXT } from "@/utils/app/constants"
import { createCanvas } from 'canvas'
import { renderIcon } from '@download/blockies'

// Render Image to base64 buffer
export async function generateAvatar({address}:{
  address:string
}) {
  // Create canvas
  const canvas = createCanvas(50, 50)
  // Draw Blockie
  const icon = renderIcon(
    { // All options are optional
        seed: address.toLowerCase(), // seed used to generate icon data, default: random
        size: 8, // width/height of the icon in blocks, default: 10
        scale: 100 // width/height of each block in pixels, default: 5
    },
    canvas
  )
  // Get encoded image
  const img = canvas.toDataURL()
  // Strip formatting
  const data = img.replace(/^data:image\/\w+;base64,/, "");
  // Create buffer
  const buf = Buffer.from(data, "base64");
  // Save Image
  const avatarFilePath = NFT_AVATAR_PATH+address+NFT_IMAGE_FILEEXT;
  const fs = require('fs')
  try {
    fs.writeFileSync(avatarFilePath,buf);
  }
  catch(e: any){
    console.log(e)
    return undefined
  }
  return avatarFilePath
}