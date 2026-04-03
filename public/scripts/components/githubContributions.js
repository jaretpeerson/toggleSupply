const API_URL = "https://github-contributions-api.jogruber.de/v4/HamedMP?y=last"
// To switch users, replace "HamedMP" after v4/ in the URL above with the desired GitHub username

const MOBILE_BREAKPOINT = 650
const TABLET_BREAKPOINT = 1000
const MOBILE_MONTHS = 5
const TABLET_MONTHS = 8
const DESKTOP_MONTHS = 12
const MONTH_NAMES = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
]

function getMonthCount() {
  if (window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches)
    return MOBILE_MONTHS
  if (window.matchMedia(`(max-width: ${TABLET_BREAKPOINT}px)`).matches)
    return TABLET_MONTHS
  return DESKTOP_MONTHS
}

async function fetchContributions() {
  const res = await fetch(API_URL)
  const data = await res.json()
  return data.contributions
}

function filterContributions(contributions, monthCount) {
  if (monthCount >= DESKTOP_MONTHS) return contributions
  const now = new Date()
  const cutoff = new Date(now.getFullYear(), now.getMonth() - monthCount + 1, 1)
  const cutoffStr = cutoff.toISOString().slice(0, 10)
  return contributions.filter((d) => d.date >= cutoffStr)
}

function buildMonths(monthCount) {
  const now = new Date()
  const container = document.getElementById("github-graph-months")
  container.innerHTML = ""

  const whiteLayer = document.createElement("div")
  whiteLayer.classList.add("github-month-highlight-text")

  for (let i = monthCount - 1; i >= 0; i--) {
    const name =
      MONTH_NAMES[new Date(now.getFullYear(), now.getMonth() - i, 1).getMonth()]

    const base = document.createElement("span")
    base.textContent = name
    container.appendChild(base)

    const highlight = document.createElement("span")
    highlight.textContent = name
    whiteLayer.appendChild(highlight)
  }

  container.appendChild(whiteLayer)

  // Sliding border box
  const box = document.createElement("div")
  box.classList.add("github-month-highlight-box")
  container.appendChild(box)
}

function buildGrid(contributions) {
  const wrapper = document.querySelector(".github-graph-grid")
  wrapper.innerHTML = ""

  const firstDate = new Date(contributions[0].date + "T00:00:00")
  const startDay = firstDate.getDay()

  const weeks = []
  let week = new Array(startDay).fill(null)

  for (const day of contributions) {
    week.push(day)
    if (week.length === 7) {
      weeks.push(week)
      week = []
    }
  }

  if (week.length > 0) {
    while (week.length < 7) week.push(null)
    weeks.push(week)
  }

  const totalCols = weeks.length

  weeks.forEach((week, colIndex) => {
    const column = document.createElement("div")
    column.classList.add("github-graph-columns")
    column.style.setProperty("--col-threshold", (colIndex / totalCols) * 0.97)

    for (const day of week) {
      const cell = document.createElement("div")
      cell.classList.add("github-graph-cell")

      if (day) {
        cell.dataset.level = day.level
        cell.title =
          day.count === 0
            ? `No contributions on ${day.date}`
            : `${day.count} contribution${day.count !== 1 ? "s" : ""} on ${day.date}`
      } else {
        cell.dataset.level = "empty"
      }

      column.appendChild(cell)
    }

    wrapper.appendChild(column)
  })
}

function setupScroll() {
  const track = document.querySelector(".github-graph-track")
  const wrapper = document.querySelector(".github-graph-wrapper")

  function onScroll() {
    const rect = track.getBoundingClientRect()
    const trackScrollable = track.offsetHeight - window.innerHeight
    const scrolled = -rect.top
    const raw = Math.max(0, Math.min(1, scrolled / trackScrollable))
    wrapper.style.setProperty("--progress", raw * raw * (3 - 2 * raw))
  }

  window.addEventListener("scroll", onScroll, { passive: true })
  onScroll()
}

function rebuild(allContributions) {
  const monthCount = getMonthCount()
  const wrapper = document.querySelector(".github-graph-wrapper")
  wrapper.style.setProperty("--month-count", monthCount)
  wrapper.style.removeProperty("--cell-size")

  buildMonths(monthCount)
  buildGrid(filterContributions(allContributions, monthCount))
}

async function init() {
  const username = new URL(API_URL).pathname.split("/").filter(Boolean).pop()
  const githubUrl = `https://github.com/${username}`
  const usernameEl = document.getElementById("github-username")
  if (usernameEl) usernameEl.textContent = username
  const profileLink = document.getElementById("github-profile-link")
  if (profileLink) profileLink.href = githubUrl

  const allContributions = await fetchContributions()
  rebuild(allContributions)
  setupScroll()

  const total = allContributions.reduce((sum, day) => sum + day.count, 0)
  const countEl = document.getElementById("github-contribution-count")
  if (countEl)
    countEl.textContent = `${total.toLocaleString()} Contributions made in the last year`

  // Rebuild if viewport crosses either breakpoint (e.g. device rotation)
  const onBreakpointChange = () => rebuild(allContributions)
  for (const bp of [MOBILE_BREAKPOINT, TABLET_BREAKPOINT]) {
    window
      .matchMedia(`(max-width: ${bp}px)`)
      .addEventListener("change", onBreakpointChange)
  }
}

init()
