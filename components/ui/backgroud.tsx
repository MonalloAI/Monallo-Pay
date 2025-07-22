"use client"

export function Background() {
  return (
    <div className="fixed inset-0 -z-10 h-full w-full bg-white">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-fuchsia-100 opacity-20 blur-[100px]" />
      <div className="absolute left-20 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-indigo-100 opacity-20 blur-[100px]" />
    </div>
  )
}