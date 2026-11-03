import { forwardRef } from 'react'

type MenuToggleProps = { open: boolean; onClick: () => void }

/** Three-bar toggle that morphs into an X (Marcus / Bennet). Top/bottom rotate, middle fades. */
export const MenuToggle = forwardRef<HTMLButtonElement, MenuToggleProps>(function MenuToggle(
  { open, onClick },
  ref,
) {
  const bar = 'absolute left-0 h-[1.5px] w-6 bg-current transition-[transform,opacity] ease-line'
  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      aria-expanded={open}
      aria-controls="site-drawer"
      aria-label={open ? 'Close menu' : 'Open menu'}
      className="relative flex h-11 w-11 items-center justify-center"
    >
      <span aria-hidden="true" className="relative block h-4 w-6">
        <span className={`${bar} top-0 duration-500 ${open ? 'translate-y-[7px] rotate-45' : ''}`} />
        <span className={`${bar} top-[7px] duration-300 ${open ? 'opacity-0' : ''}`} />
        <span className={`${bar} bottom-0 duration-500 ${open ? '-translate-y-[7px] -rotate-45' : ''}`} />
      </span>
    </button>
  )
})
