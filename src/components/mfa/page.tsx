export function ShowKeyCount({keycount}: {
  keycount: number
}) {
  return(
    <>
      <p>You have {keycount} registered security keys.</p>
    </>
  )
}

export function RevokeAllKeysModal({onRevoke}: {onRevoke: any}){
  async function revokeKeys(){
    const revokeReq = await fetch('/api/mfa/revokeKeys')
    const revokeRes = await revokeReq.json()
    console.log(revokeRes)
    if(revokeRes.revoked){
      alert('All keys revoked!')
    }
    else {
      alert('Failed to revoke keys.')
    }
    onRevoke()
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
