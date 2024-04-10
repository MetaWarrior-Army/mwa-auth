import { APP_BASE_URL } from '@/utils/app/constants'

export async function screenInvite(invite:string) {

  // Verify valid characters
  if(/(#|\$|\^|%|@|!|&|\*|\(|\)|\+|=|\[|\]|{|}|\\|\||\;|:|'|"|~|`|,|\.|\?|>|\/|<)/.test(invite)) return {ok:false,msg:'Invalid character'}

  const req = await fetch(APP_BASE_URL+'/api/user/checkinvite', {
    method: 'POST',
    headers: {'Content-type':'application/json'},
    body: JSON.stringify({msg:btoa(invite)})
  })
  const res = await req.json()
  if(!res) return {ok:false,msg:'Can\'t verify'}
  if(res.ok) return {ok:true,msg:'Valid invite code'}
  else return {ok:false,msg:res.error}
}