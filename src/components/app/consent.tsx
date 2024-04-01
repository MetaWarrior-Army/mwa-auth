import Image from 'next/image'

export function ConsentModal({ clientName, consentChallenge, logoUri}: {
  clientName: string, 
  consentChallenge: string,
  logoUri: string
}) {

  // User consents
  async function consent() {
    const acceptReq = await fetch('/api/oauth/acceptConsent', {
      method: 'POST',
      headers: {'Content-type':'application/json'},
      body: JSON.stringify({consent_challenge: consentChallenge})
    })
    const acceptRes = await acceptReq.json()
    if(!acceptRes) throw Error('Failed to get response from /api/acceptConsent')
    if(acceptRes.error) throw Error(acceptRes.error)
    // Redirect user client side
    window.location.href=acceptRes.redirect_to
  }

  // User disagrees
  async function disagree() {
    const rejectReq = await fetch('/api/oauth/rejectConsent', {
      method: 'POST',
      headers: {'Content-type':'application/json'},
      body: JSON.stringify({consent_challenge: consentChallenge})
    })
    const rejectRes = await rejectReq.json()
    if(!rejectRes) throw Error('Failed to get response from /api/rejectConsent')
    if(rejectRes.error) throw Error(rejectRes.error)
    // Redirect user client side
    window.location.href=rejectRes.redirect_to
  }

  return (
    <div className="space-y-6 py-8 text-base leading-7 dark:text-slate-400">

      <p>Share your profile with <span className="font-bold">{clientName}</span>?</p>
      <Image alt='logo_uri' width={60} height={60} className="mx-auto" src={logoUri} />

      <p><span className="font-bold">{clientName}</span> is requesting your <span className="font-bold text-yellow-300">username</span> and <span className="font-bold text-yellow-300">email address</span>. Do you agree to share this information with them?</p>
      <p>If not, you will be redirected back to <span className="font-bold">{clientName}</span> without revealing your information.</p>

      <div id="consent">
        <p className="p-2">
          <button
            onClick={consent}
            className="bg-slate-950 p-2 w-full text-yellow-500 rounded-lg shadow-xl border-solid border-2 hover:border-dotted border-yellow-500">
            Agree
          </button>
        </p>
        <p className="p-2">
          <button
            onClick={disagree}
            className="bg-slate-950 p-2 w-full text-slate-500 rounded-lg shadow-xl border-solid border-2 hover:border-dotted border-slate-500">
            Disagree
          </button>
        </p>
      </div>
      
    </div>
  )
}