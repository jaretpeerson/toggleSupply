const menuBox = document.querySelectorAll(".menu-box")

menuBox.forEach((box) => {
  const menuText = box.querySelector(".nav-menu-text")
  const link = box.querySelector("a")
  const navLink = link ? link.getAttribute("href") : null

  if (!menuText) return

  let hideTimeout

  // Add/Remove class on hover
  box.addEventListener("mouseenter", () => {
    clearTimeout(hideTimeout)
    menuText.classList.add("show")
    box.classList.add("hovering")
  })

  box.addEventListener("mouseleave", () => {
    if (box.classList.contains("active")) return
    hideTimeout = setTimeout(() => {
      menuText.classList.remove("show")
      box.classList.remove("hovering")
    }, 0)
  })

  // Active page detection
  if (navLink && navLink !== "#") {
    const navURL = new URL(navLink, window.location.href)
    const navPathEnding = navURL.pathname.split("/").pop()

    // Handle homepage separately
    if (navURL.pathname === "/" && window.location.pathname === "/") {
      box.classList.add("active")
      menuText.classList.add("show")
      return
    }
    if (navURL.pathname === "/") {
      return
    }

    // Match subpages by their ending
    if (navPathEnding && window.location.pathname.endsWith(navPathEnding)) {
      box.classList.add("active")
      menuText.classList.add("show")
    }
  }
})

// Toggle logo text visibility on scroll
const navLogoTextSection = document.querySelector(".nav-logo-text-section")
const scrollThreshold = 10

window.addEventListener("scroll", function () {
  const currentScrollPosition =
    window.pageYOffset || document.documentElement.scrollTop

  if (currentScrollPosition <= scrollThreshold) {
    navLogoTextSection.classList.remove("active")
    return
  }

  navLogoTextSection.classList.add("active")
})

// Smooth scroll to top on logo click
navLogoTextSection.addEventListener("click", function (event) {
  event.preventDefault()
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  })
  navLogoTextSection.classList.remove("active")
})
