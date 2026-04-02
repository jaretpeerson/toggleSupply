const API_URL =
  "https://github-contributions-api.jogruber.de/v4/andrewgolovanov?y=last"
// To switch users, replace "jaretpeerson" in the URL above with the desired GitHub username

async function fetchContributions() {
  const res = await fetch(API_URL)
  const data = await res.json()
  return data.contributions
}

function buildMonths() {
  const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]
  const now = new Date()
  const container = document.getElementById("github-graph-months")
  container.innerHTML = ""

  const labels = []
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    labels.push(monthNames[d.getMonth()])
  }

  // Dim base layer
  labels.forEach(name => {
    const span = document.createElement("span")
    span.textContent = name
    container.appendChild(span)
  })

  // White text layer — clipped to the sliding box via CSS
  const whiteLayer = document.createElement("div")
  whiteLayer.classList.add("github-month-highlight-text")
  labels.forEach(name => {
    const span = document.createElement("span")
    span.textContent = name
    whiteLayer.appendChild(span)
  })
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

async function init() {
  const username = new URL(API_URL).pathname.split("/").filter(Boolean).pop()
  const usernameEl = document.getElementById("github-username")
  if (usernameEl) usernameEl.textContent = username

  buildMonths()

  const contributions = await fetchContributions()
  buildGrid(contributions)
  setupScroll()

  const total = contributions.reduce((sum, day) => sum + day.count, 0)
  const countEl = document.getElementById("github-contribution-count")
  if (countEl) countEl.textContent = `${total.toLocaleString()} Contributions made in the last year`
}

init()
