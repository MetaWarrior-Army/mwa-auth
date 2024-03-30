import { ReactNode } from "react"

export function QuestionsBanner() {
  return (
    <div className="pt-8 text-base font-semibold leading-7">
      <p className="text-slate-200">Questions?</p>
      <p><a href="#" className="text-yellow-500 hover:text-yellow-700">Answers &rarr;</a></p>
    </div>
  )
}

export function Modal(props: { children: ReactNode }) {
  return(
    <div className="relative dark:bg-gray-800 dark:text-slate-200 px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-lg sm:rounded-lg sm:px-10">
      <div className="mx-auto max-w-md">
        <div className="divide-y divide-gray-300/50">
          {props.children}
        </div>
      </div>
    </div>
  )
}

