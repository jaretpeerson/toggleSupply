// Find all elements that want scroll progress
const elements = document.querySelectorAll('[data-string="scroll"]')

window.addEventListener("scroll", () => {
  const scrollHeight =
    document.documentElement.scrollHeight - window.innerHeight
  const progress = window.scrollY / scrollHeight

  // Write the same --progress value to each element
  elements.forEach((el) => {
    el.style.setProperty("--progress", progress)
  })
})
