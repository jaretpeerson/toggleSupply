// Footer visibility and float state management
const footer = document.querySelector(".footer-desktop")
const footerLineCover = document.querySelector(".footer-desktop-line-cover")
const footerToTop = document.getElementById("footer-to-top")
const footerShareProject = document.getElementById("footer-share-project")
const footerShareProjectText = document.getElementById(
  "footer-share-project-text",
)
const scrollThreshold = 60

// Store original footer content
let originalFooterContent = null
let isShowingSocialMedia = false

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

function storeOriginalContent() {
  if (!originalFooterContent) {
    // Get all items and separators
    const items = footer.querySelectorAll(
      ".footer-desktop-item, .footer-desktop-item-separator",
    )
    originalFooterContent = Array.from(items).map((item) =>
      item.cloneNode(true),
    )
  }
}

function showSocialMediaOptions() {
  if (isShowingSocialMedia) return

  storeOriginalContent()
  isShowingSocialMedia = true

  const currentUrl = window.location.href
  const shareText = encodeURIComponent("Check out Toggle Supply!")

  const socialMediaPlatforms = [
    {
      name: "LinkedIn",
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent("Toggle Supply")}&summary=${encodeURIComponent("A CSS-first component library. From state to style.")}`,
    },
    {
      name: "X.com",
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${shareText}`,
    },
    {
      name: "Facebook",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
    },
    {
      name: "Reddit",
      url: `https://www.reddit.com/submit?url=${encodeURIComponent(currentUrl)}&title=${shareText}`,
    },
    {
      name: "Copy Link",
      action: "copy",
    },
  ]

  // Clear footer except logo and line cover
  const items = footer.querySelectorAll(
    ".footer-desktop-item, .footer-desktop-item-separator",
  )
  items.forEach((item) => item.remove())

  // Add social media items
  socialMediaPlatforms.forEach((platform, index) => {
    if (index > 0) {
      const separator = document.createElement("div")
      separator.className = "footer-desktop-item-separator"
      footer.insertBefore(
        separator,
        footer.querySelector(".footer-desktop-logo"),
      )
    }

    const item = document.createElement(
      platform.action === "copy" ? "div" : "a",
    )
    item.className = "footer-desktop-item social-media-item"

    if (platform.action !== "copy") {
      item.href = platform.url
      item.target = "_blank"
      item.rel = "noopener noreferrer"
    }

    item.innerHTML = `
      <div class="footer-desktop-text">${platform.name}</div>
    `

    // Add click handler
    item.addEventListener("click", (e) => {
      if (platform.action === "copy") {
        e.preventDefault()
        navigator.clipboard.writeText(currentUrl)
        const textEl = item.querySelector(".footer-desktop-text")
        textEl.textContent = "Copied!"
      }

      // Restore original content after a short delay
      setTimeout(() => {
        restoreOriginalContent()
      }, 300)
    })

    footer.insertBefore(item, footer.querySelector(".footer-desktop-logo"))
  })

  // Add close button at the end
  const separator = document.createElement("div")
  separator.className = "footer-desktop-item-separator"
  footer.insertBefore(separator, footer.querySelector(".footer-desktop-logo"))

  const closeButton = document.createElement("div")
  closeButton.className = "footer-desktop-item close-social"
  closeButton.innerHTML = `
    <div class="footer-desktop-text">Return</div>
  `

  closeButton.addEventListener("click", (e) => {
    e.preventDefault()
    restoreOriginalContent()
  })

  footer.insertBefore(closeButton, footer.querySelector(".footer-desktop-logo"))
}

function restoreOriginalContent() {
  if (!originalFooterContent || !isShowingSocialMedia) return

  isShowingSocialMedia = false

  // Remove current items
  const items = footer.querySelectorAll(
    ".footer-desktop-item, .footer-desktop-item-separator",
  )
  items.forEach((item) => item.remove())

  // Restore original items
  const logo = footer.querySelector(".footer-desktop-logo")
  originalFooterContent.forEach((item) => {
    footer.insertBefore(item.cloneNode(true), logo)
  })

  // Re-attach event listeners
  reattachEventListeners()
}

function reattachEventListeners() {
  const newFooterToTop = document.getElementById("footer-to-top")
  const newFooterShareProject = document.getElementById("footer-share-project")
  const newFooterShareProjectText = document.getElementById(
    "footer-share-project-text",
  )

  if (newFooterToTop) {
    newFooterToTop.addEventListener("click", scrollToTop)
  }

  if (newFooterShareProject) {
    newFooterShareProject.addEventListener("click", showSocialMediaOptions)
  }

  if (newFooterShareProjectText) {
    newFooterShareProjectText.textContent = "Share Site"
  }
}

window.addEventListener("scroll", updateFooterState)

if (footerToTop) {
  footerToTop.addEventListener("click", scrollToTop)
}

if (footerShareProject) {
  footerShareProject.addEventListener("click", showSocialMediaOptions)
}

if (footerShareProjectText) {
  footerShareProjectText.textContent = "Share Site"
}

updateFooterState()
