const elements = document.querySelectorAll('[data-string="scroll"]')

elements.forEach((el) => el.style.setProperty("--progress", 0))

window.addEventListener("scroll", () => {
  const scrollHeight =
    document.documentElement.scrollHeight - window.innerHeight
  const progress = window.scrollY / scrollHeight

  elements.forEach((el) => {
    el.style.setProperty("--progress", progress)
  })
})
