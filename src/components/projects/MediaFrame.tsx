import type { Project } from '../../data/types'

/** Project screenshot slot. Shows the first real image, or an honest empty frame until one exists. */
export function MediaFrame({ project }: { project: Project }) {
  const image = project.images?.[0]

  if (image) {
    return (
      <img
        src={image.src}
        alt={image.alt}
        loading="lazy"
        decoding="async"
        className="media-in h-full min-h-56 w-full rounded-media object-cover"
      />
    )
  }

  return (
    <div className="media-in flex h-full min-h-56 items-center justify-center rounded-media border border-dashed border-ink-line bg-ink-2 p-6 text-center">
      <p className="text-sm text-ink-muted">
        Screenshot pending
        <span className="block text-xs">Add one under project.images in src/data/projects.ts</span>
      </p>
    </div>
  )
}
