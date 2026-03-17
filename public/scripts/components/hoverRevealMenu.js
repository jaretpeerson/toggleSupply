const button = document.querySelectorAll(".btn")
const isTouchDevice = window.matchMedia("(pointer: coarse)").matches

button.forEach((btn) => {
  const btnText = btn.querySelector(".btn-text")

  const navLink = btn.getAttribute("href")

  if (navLink && navLink !== "#") {
    const navURL = new URL(navLink, window.location.href)
    const navPathEnding = navURL.pathname.replace(/\/$/, "").split("/").pop()

    if (window.location.pathname.replace(/\/$/, "").endsWith(navPathEnding)) {
      btnText.classList.add("active")
    }
  }

  if (isTouchDevice) {
    btn.addEventListener("click", () => {
      button.forEach((otherBtn) => {
        otherBtn.querySelector(".btn-text").classList.remove("active")
      })

      btnText.classList.add("active")
    })
  }
})
