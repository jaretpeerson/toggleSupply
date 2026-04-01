const API_URL =
  "https://github-contributions-api.jogruber.de/v4/jaretpeerson?y=last"
// To switch users, replace "jaretpeerson" in the URL above with the desired GitHub username

async function fetchContributions() {
  const res = await fetch(API_URL)
  const data = await res.json()
  return data.contributions
}

function buildGrid(contributions) {
  const wrapper = document.querySelector(".github-graph-wrapper")
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
    column.style.setProperty("--col-threshold", colIndex / totalCols)

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

  function easeOut(t) {
    return 1 - Math.pow(1 - t, 3)
  }

  function onScroll() {
    const rect = track.getBoundingClientRect()
    const trackScrollable = track.offsetHeight - window.innerHeight
    const scrolled = -rect.top
    const raw = Math.max(0, Math.min(1, scrolled / trackScrollable))
    wrapper.style.setProperty("--progress", easeOut(raw))
  }

  window.addEventListener("scroll", onScroll, { passive: true })
  onScroll()
}

async function init() {
  const contributions = await fetchContributions()
  buildGrid(contributions)
  setupScroll()
}

init()
