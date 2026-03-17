const footerMobilePieMenu = document.getElementById("footer-mobile-pie-menu")
const footerMobileWrapper = document.querySelector(".footer-mobile-wrapper")
const footerMobileBackdrop = document.querySelector(".footer-mobile-backdrop")
const footerMobilePieMenuText = document.querySelector(
  ".footer-mobile-item.pie-menu .footer-mobile-text",
)
const footerMobilePieMenuItem = document.querySelector(
  ".footer-mobile-item.pie-menu",
)

// Float footer
const footerMobileShareProject = document.querySelector(
  ".footer-mobile-item.share-project",
)
const footerMobileShareProjectText =
  footerMobileShareProject?.querySelector("p")

// Fixed footer
const footerMobileFixedShareProject = document.querySelector(
  ".footer-mobile-fixed-item.share-project",
)
const footerMobileFixedShareProjectText =
  footerMobileFixedShareProject?.querySelector("p")

// Toggle Classes on Scroll
let lastScrollPosition = 0
let shareProjectTimeout = null

footerMobilePieMenu.addEventListener("click", () => {
  footerMobileWrapper.classList.toggle("active")
})

footerMobileBackdrop.addEventListener("click", () => {
  footerMobileWrapper.classList.remove("active")
})

footerMobilePieMenuText.addEventListener("click", () => {
  footerMobileWrapper.classList.remove("active")
})

if (footerMobileShareProject) {
  footerMobileShareProject.addEventListener("click", () => {
    const currentUrl = window.location.href
    navigator.clipboard.writeText(currentUrl)

    if (footerMobileShareProjectText) {
      footerMobileShareProjectText.textContent = "Link Copied!"

      if (shareProjectTimeout) {
        clearTimeout(shareProjectTimeout)
      }

      shareProjectTimeout = setTimeout(() => {
        footerMobileShareProjectText.textContent = "Share"
      }, 2200)
    }
  })
}

if (footerMobileFixedShareProject) {
  footerMobileFixedShareProject.addEventListener("click", () => {
    const currentUrl = window.location.href
    navigator.clipboard.writeText(currentUrl)

    if (footerMobileFixedShareProjectText) {
      footerMobileFixedShareProjectText.textContent = "Link Copied!"

      if (shareProjectTimeout) {
        clearTimeout(shareProjectTimeout)
      }

      shareProjectTimeout = setTimeout(() => {
        footerMobileFixedShareProjectText.textContent = "Share"
      }, 2200)
    }
  })
}

window.addEventListener("scroll", () => {
  const currentScrollPosition = window.scrollY
  const windowHeight = window.innerHeight
  const documentHeight = document.documentElement.scrollHeight
  const distanceFromBottom =
    documentHeight - (currentScrollPosition + windowHeight)

  if (currentScrollPosition > 60) {
    footerMobilePieMenuItem.classList.remove("invisible")
  }

  if (currentScrollPosition <= 60) {
    footerMobilePieMenuItem.classList.add("invisible")
  }

  if (distanceFromBottom <= 300) {
    footerMobileWrapper.classList.add("bottom")
  }

  if (distanceFromBottom > 300) {
    footerMobileWrapper.classList.remove("bottom")
  }

  lastScrollPosition = currentScrollPosition
})
