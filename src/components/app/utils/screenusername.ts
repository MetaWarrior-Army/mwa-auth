import { APP_BASE_URL, USERNAME_MAX_LENGTH, USERNAME_MIN_LENGTH } from "@/utils/app/constants";
import { BLOCKED_USERNAMES } from '@/components/app/utils/blockedusernames'

export async function screenUsername(username: string){
  
  // First check length
  if(username.length < USERNAME_MIN_LENGTH){
    return {ok:false,msg:'Username is too short.'}
  }
  if(username.length > USERNAME_MAX_LENGTH) {
    return {ok:false,msg:'Username is too long.'}
  }

  // Check static list of reserved usernames
  if(BLOCKED_USERNAMES.includes(username)) return {ok:false,msg:'Username unavailable.'}

  // Check database for availability
  const checkUsername = await fetch(APP_BASE_URL+'/api/user/checkusername',{
    method: 'POST',
    headers: {'Content-type':'application/json'},
    body: JSON.stringify({username: username})
  })
  const checkResult = await checkUsername.json()
  if(!checkResult) return undefined
  if(!checkResult.valid) return {ok:false,msg:checkResult.error}
  
  // Username available
  return {ok:true,msg:'Username available!'}
}