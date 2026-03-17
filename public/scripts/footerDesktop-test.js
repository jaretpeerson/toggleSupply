const footerWrapper = document.querySelector(".footer-desktop-wrapper")
const footerMainWrapper = document.querySelector(".footer-desktop-main-wrapper")
const footerSocialWrapper = document.querySelector(
  ".footer-desktop-social-wrapper",
)
const footerLineCover = document.querySelector(".footer-desktop-line-cover")
const footerItems = document.querySelectorAll(".footer-desktop-item")
const scrollThreshold = 60

// Get specific items by their index or text content
const shareItem = Array.from(footerItems).find(
  (item) =>
    item.querySelector(".footer-desktop-item-text")?.textContent === "Share",
)
const topItem = Array.from(footerItems).find(
  (item) =>
    item.querySelector(".footer-desktop-item-text")?.textContent === "Top",
)
const exitItem = Array.from(footerItems).find(
  (item) =>
    item.querySelector(".footer-desktop-item-text")?.textContent === "Exit",
)

function updateFooterState() {
  const scrollPosition = window.scrollY
  const windowHeight = window.innerHeight
  const documentHeight = document.documentElement.scrollHeight
  const distanceFromBottom = documentHeight - (scrollPosition + windowHeight)

  // Show/hide footer based on scroll
  if (scrollPosition > scrollThreshold) {
    footerWrapper.classList.remove("invisible")
  } else {
    footerWrapper.classList.add("invisible")
  }

  // Toggle float state based on distance from bottom
  if (distanceFromBottom < 80) {
    footerWrapper.classList.remove("float")
    footerLineCover.classList.remove("invisible")
  } else {
    footerWrapper.classList.add("float")
    footerLineCover.classList.add("invisible")
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" })
}

function openSocialPanel() {
  footerMainWrapper.classList.remove("active")
  footerSocialWrapper.classList.add("active")
}

function closeSocialPanel() {
  footerSocialWrapper.classList.remove("active")
  footerMainWrapper.classList.add("active")
}

// Event listeners
window.addEventListener("scroll", updateFooterState)

topItem?.addEventListener("click", scrollToTop)
shareItem?.addEventListener("click", openSocialPanel)
exitItem?.addEventListener("click", closeSocialPanel)

// Initialize
updateFooterState()
