const cards = document.querySelectorAll('[data-string="scroll"]')

cards.forEach((card) => {
  card.style.setProperty("--progress", 0)
  card.style.setProperty("--fade-progress", 0)
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

window.addEventListener(
  "scroll",
  () => {
    const scrollY = window.scrollY
    const halfScrollHeight = scrollHeight * 0.5

    const phaseOne = clamp01(scrollY / halfScrollHeight)
    const phaseTwo = clamp01((scrollY - halfScrollHeight) / halfScrollHeight)

    cards.forEach((card) => {
      card.style.setProperty("--progress", easeOut(phaseOne))
      card.style.setProperty("--fade-progress", easeOut(phaseTwo))
    })
  },
  { passive: true },
)
