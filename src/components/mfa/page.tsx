import { toasterNotify } from '@/utils/app/toaster'

export function ShowKeyCount({keycount}: {
  keycount: number
}) {
  return(
    <>
      {(keycount == 1) ?
        <p className="text-lg font-bold">You have <span className="text-yellow-500 text-xl font-bold">{keycount}</span> registered security key.</p>
        :
        <p className="text-lg font-bold">You have <span className="text-yellow-500 text-xl font-bold">{keycount}</span> registered security keys.</p>
      }
      
    </>
  )
}

export function RevokeAllKeysModal({onRevoke}: {onRevoke: any}){
  async function revokeKeys(){
    const revokeReq = await fetch('/api/mfa/revokeKeys')
    const revokeRes = await revokeReq.json()
    if(revokeRes.revoked){
      toasterNotify({message:'All Keys Revoked!',type:'success'})
      onRevoke()
    }
    else {
      toasterNotify({message:revokeRes.error,type:'error'})
    }
  }
  return (
    <>
      <div id="signout" className="flex p-2">
        <button 
          className="bg-slate-950 p-2 w-full text-slate-500 rounded-lg shadow-xl border-solid border-2 hover:border-dotted border-slate-500"
          onClick={() => revokeKeys()}>Revoke Keys</button>
      </div>
    </>
  )
}
