const footerMain = document.querySelector(".footer-desktop.main")
const footerSocials = document.querySelector(".footer-desktop.socials")
const footerLineCover = document.querySelector(".footer-desktop-line-cover")
const footerToTop = document.getElementById("footer-to-top")
const footerShareProject = document.getElementById("footer-share-project")
const footerClose = document.querySelector(".footer-desktop-item.close")
const scrollThreshold = 60

function updateFooterState() {
  const scrollPosition = window.scrollY
  const windowHeight = window.innerHeight
  const documentHeight = document.documentElement.scrollHeight
  const distanceFromBottom = documentHeight - (scrollPosition + windowHeight)

  if (scrollPosition > scrollThreshold) {
    footerMain.classList.remove("invisible")
  } else {
    footerMain.classList.add("invisible")
  }

  if (distanceFromBottom < 80) {
    footerMain.classList.remove("float")
    footerSocials.classList.remove("float")
    footerLineCover.classList.remove("invisible")
  } else {
    footerMain.classList.add("float")
    footerSocials.classList.add("float")
    footerLineCover.classList.add("invisible")
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" })
}

function openSocialPanel() {
  footerSocials.classList.remove("inactive")
  footerMain.classList.add("inactive")
}

function closeSocialPanel() {
  footerSocials.classList.add("inactive")
  footerMain.classList.remove("inactive")
}

window.addEventListener("scroll", updateFooterState)

footerToTop?.addEventListener("click", scrollToTop)
footerShareProject?.addEventListener("click", openSocialPanel)
footerClose?.addEventListener("click", closeSocialPanel)

updateFooterState()
