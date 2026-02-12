// Footer visibility and float state management
const footer = document.querySelector(".footer-desktop")
const footerLineCover = document.querySelector(".footer-desktop-line-cover")
const footerToTop = document.getElementById("footer-to-top")
const footerShareProject = document.getElementById("footer-share-project")
const footerShareProjectText = document.getElementById(
  "footer-share-project-text",
)
const scrollThreshold = 60

function updateFooterState() {
  const scrollPosition = window.scrollY
  const windowHeight = window.innerHeight
  const documentHeight = document.documentElement.scrollHeight
  const distanceFromBottom = documentHeight - (scrollPosition + windowHeight)

  if (scrollPosition > scrollThreshold) {
    footer.classList.remove("invisible")
  } else {
    footer.classList.add("invisible")
  }

  if (distanceFromBottom < 80) {
    footer.classList.remove("float")
    footerLineCover.classList.remove("invisible")
  } else {
    footer.classList.add("float")
    footerLineCover.classList.add("invisible")
  }
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  })
}

function copyPageUrl() {
  const currentUrl = window.location.href
  navigator.clipboard.writeText(currentUrl)

  if (footerShareProjectText) {
    footerShareProjectText.textContent = "Link Copied"
  }
}

window.addEventListener("scroll", updateFooterState)

if (footerToTop) {
  footerToTop.addEventListener("click", scrollToTop)
}

if (footerShareProject) {
  footerShareProject.addEventListener("click", copyPageUrl)
}

if (footerShareProjectText) {
  footerShareProjectText.textContent = "Share Site"
}

updateFooterState()
