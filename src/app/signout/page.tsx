'use client'

import {signOut} from 'next-auth/react'
import Cookies from 'js-cookie'
import {useState,useEffect} from 'react'

export default function SignoutPage() {
  const [redirect,setRedirect] = useState('')
  const cookies = Cookies.get()

  // Process Sign Out
  useEffect(() => {
    async function processSignOut() {
      // No redirect set
      if(redirect == ''){
        // Check cookies
        if(cookies.auth_redirect) {
          setRedirect(cookies.auth_redirect)
        }
      }
      // Sign Out and handle redirect
      else{
        const resp = await signOut({redirect: false})
        if(resp.url) {
          window.location.href = redirect
        }
      }
    }
    processSignOut()
  }, [redirect,cookies])

  return (
    <div className="relative px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-lg sm:rounded-lg sm:px-10">
      <div className="mx-auto max-w-md">
        <span className="relative mx-auto flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-500 opacity-75"></span></span>
      </div>
    </div>
  )
}