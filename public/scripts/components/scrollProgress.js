const elements = document.querySelectorAll('[data-string="scroll"]')

elements.forEach((el) => {
  el.style.setProperty("--progress", 0)
  el.style.setProperty("--fade-progress", 0)
})

function easeOut(t) {
  return 1 - Math.pow(1 - t, 3)
}

function clamp01(v) {
  return Math.max(0, Math.min(1, v))
}

let scrollHeight = document.documentElement.scrollHeight - window.innerHeight

window.addEventListener("resize", () => {
  scrollHeight = document.documentElement.scrollHeight - window.innerHeight
})

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY
  const halfHeight = scrollHeight * 0.5

  // Phase 1: cards fan out (first half)
  const rawProgress = clamp01(scrollY / halfHeight)

  // Phase 2: cards blur and fade out from center (second half)
  const rawFade = clamp01((scrollY - halfHeight) / halfHeight)

  elements.forEach((el) => {
    el.style.setProperty("--progress", easeOut(rawProgress))
    el.style.setProperty("--fade-progress", easeOut(rawFade))
  })
}, { passive: true })
