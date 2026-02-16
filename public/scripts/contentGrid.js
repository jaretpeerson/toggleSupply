const categoriesTrack = document.querySelector(".filter-track-categories-inner")
const grid = document.getElementById("contentGrid")
let content = []
let itemsPerLoad = 3
let currentIndex = 0
let currentCards = []

// Load content data from inline JSON or fetch as fallback
function loadContent() {
  const inlineData = document.getElementById("contentData")
  if (inlineData) {
    content = JSON.parse(inlineData.textContent)
  } else {
    console.error("No inline content data found")
    return
  }

  const categoriesList = [...new Set(content.map((c) => c.category))]

  const categoriesCount = content.reduce((counts, item) => {
    const category = item.category
    counts[category] = (counts[category] || 0) + 1
    return counts
  }, {})

  categoriesList.sort(
    (a, b) => categoriesCount[b] - categoriesCount[a] || a.localeCompare(b),
  )

  const categories = ["All", ...categoriesList]

  // Default sort cards by newest date
  content.sort((a, b) => new Date(b.date) - new Date(a.date))

  // Render filter buttons
  categories.forEach((category) => {
    const filterBtn = document.createElement("button")
    filterBtn.textContent = category.toUpperCase()
    filterBtn.classList.add("categories-btn")
    if (category === "All") filterBtn.classList.add("active")
    categoriesTrack.appendChild(filterBtn)
  })

  // If server-rendered cards exist, adopt them instead of re-rendering
  const ssrCards = grid.querySelectorAll("[data-ssr]")
  if (ssrCards.length > 0) {
    ssrCards.forEach((card) => card.removeAttribute("data-ssr"))
    currentCards = content
    currentIndex = ssrCards.length
    firstRender = false
  } else {
    renderContent(content, grid)
  }

  // Filter grid cards on category selection
  categoriesTrack.addEventListener("click", (e) => {
    if (!e.target.classList.contains("categories-btn")) return

    document
      .querySelectorAll(".categories-btn")
      .forEach((btn) => btn.classList.remove("active"))
    e.target.classList.add("active")

    // Filter cards in grid
    const category = e.target.textContent
    if (category === "ALL") {
      renderContent(content, grid)
    } else {
      const filtered = content.filter(
        (e) => e.category.toUpperCase() === category,
      )
      renderContent(filtered, grid)
    }
  })
}

// Render content helper function
let firstRender = true
let isRendering = false

function renderContent(cards, grid) {
  if (isRendering) return
  isRendering = true

  const today = new Date()
  const oneMonthAgo = new Date()
  oneMonthAgo.setMonth(today.getMonth() - 1)

  currentCards = cards
  currentIndex = 0

  const allCards = Array.from(grid.querySelectorAll(".content-card"))
  const initialLoadCount = itemsPerLoad * 2 // Load 6 initially when itemsPerLoad = 3

  if (allCards.length > 0) {
    grid.style.opacity = "0"

    setTimeout(() => {
      grid.innerHTML = ""

      const firstBatch = currentCards.slice(0, initialLoadCount)
      addNewCards(firstBatch, grid, oneMonthAgo, false, true)

      grid.style.opacity = "1"
      isRendering = false
      currentIndex = firstBatch.length
    }, 300)
  } else {
    grid.innerHTML = ""

    const firstBatch = currentCards.slice(0, initialLoadCount)
    addNewCards(firstBatch, grid, oneMonthAgo, true, true)

    isRendering = false
    firstRender = false
    currentIndex = firstBatch.length
  }
}

// Add cards and fade-in
function addNewCards(cards, grid, oneMonthAgo, instant = false, isFirstBatch = false) {
  cards.forEach((content, index) => {
    const card = document.createElement("article")
    card.classList.add("content-card")

    if (!instant) {
      card.classList.add("hidden")
    }

    const isComponentOrInspiration =
      content.kind === "component" || content.kind === "inspiration"

    const imgAttrs = `width="750" height="422" decoding="async"` +
      (isFirstBatch && index === 0 ? ` fetchpriority="high"` : "") +
      (!isFirstBatch ? ` loading="lazy"` : "")

    if (isComponentOrInspiration) {
      card.innerHTML = `
    <a href="${content.href}">
      <img src="${content.image}" alt="${content.title}" ${imgAttrs}>
    </a>
    <div class="content-data">
      <a href="${content.href}"><h3>${content.title}</h3></a>
      <p>Category: ${content.category}</p>
    </div>
  `
    }

    if (content.kind === "button") {
      card.innerHTML = `
        <iframe src="${content.html}" title="${content.title}" scrolling="no"></iframe>
        <div class="content-data">
          <h3>${content.title}</h3>
          <p>Category: ${content.category}</p>
        </div>
      `
    }

    // Add "New!" label if <1Mo Old
    const contentDate = new Date(content.date)
    if (contentDate >= oneMonthAgo) {
      const newLabel = document.createElement("span")
      newLabel.classList.add("new-label")
      newLabel.textContent = "New!"
      card.appendChild(newLabel)
    }

    grid.appendChild(card)

    // Staggered fade-in
    if (!instant) {
      const delay = index * 100
      card.style.transitionDelay = `${delay}ms`

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          card.classList.remove("hidden")
        })
      })

      card.addEventListener(
        "transitionend",
        () => {
          card.style.transitionDelay = ""
        },
        { once: true },
      )
    }
  })
}

loadContent()

// Infinite Scroll
window.addEventListener("scroll", () => {
  if (isRendering) return

  const lastCard = grid.querySelector(".content-card:last-child")
  if (!lastCard) return

  const rect = lastCard.getBoundingClientRect()
  const distanceFromBottom = rect.bottom - window.innerHeight
  const triggerDistance = -100 // Load new cards when last card is 100px above bottom of viewport

  if (
    distanceFromBottom <= triggerDistance &&
    currentIndex < currentCards.length &&
    !isRendering
  ) {
    isRendering = true

    const today = new Date()
    const oneMonthAgo = new Date()
    oneMonthAgo.setMonth(today.getMonth() - 1)

    const nextBatch = currentCards.slice(
      currentIndex,
      currentIndex + itemsPerLoad,
    )

    addNewCards(nextBatch, grid, oneMonthAgo)
    currentIndex += nextBatch.length

    isRendering = false
  }
})

// Categories Track: Scroll pre-defined distance on arrow click
const arrowRight = document.querySelector(
  ".filter-track-categories-arrow-right",
)
const arrowLeft = document.querySelector(".filter-track-categories-arrow-left")
const fadeRight = document.querySelector(".filter-track-categories-fade-right")
const fadeLeft = document.querySelector(".filter-track-categories-fade-left")

const scrollAmount = 275

arrowRight.addEventListener("click", () => {
  categoriesTrack.scrollBy({
    left: scrollAmount,
    behavior: "smooth",
  })
})

arrowLeft.addEventListener("click", () => {
  categoriesTrack.scrollBy({
    left: -scrollAmount,
    behavior: "smooth",
  })
})

// Categories Track: Show/hide arrows appropriately
function showHideArrows() {
  const maxScrollLeft =
    categoriesTrack.scrollWidth - categoriesTrack.clientWidth

  if (maxScrollLeft <= 0) {
    arrowLeft.classList.remove("visible")
    fadeLeft.classList.remove("visible")
    arrowRight.classList.remove("visible")
    fadeRight.classList.remove("visible")
    return
  }

  if (categoriesTrack.scrollLeft > 0) {
    arrowLeft.classList.add("visible")
    fadeLeft.classList.add("visible")
  } else {
    arrowLeft.classList.remove("visible")
    fadeLeft.classList.remove("visible")
  }

  if (categoriesTrack.scrollLeft >= maxScrollLeft - 1) {
    arrowRight.classList.remove("visible")
    fadeRight.classList.remove("visible")
  } else {
    arrowRight.classList.add("visible")
    fadeRight.classList.add("visible")
  }
}

arrowRight.style.transition = "none"
fadeRight.style.transition = "none"

window.addEventListener("load", showHideArrows)
categoriesTrack.addEventListener("scroll", showHideArrows)
window.addEventListener("resize", showHideArrows)

// Watch for when the categoriesTrack actually gets its size
const resizeObserver = new ResizeObserver(() => {
  showHideArrows()
})
resizeObserver.observe(categoriesTrack)

showHideArrows()

// Small fix so right arrow doesn't ease in on page load
setTimeout(() => {
  arrowRight.style.transition = ""
  fadeRight.style.transition = ""
}, 50)

// Categories Track: Dragging functionality
let isDown = false
let startX
let scrollLeft
let hasDragged = false
const dragThreshold = 5

categoriesTrack.addEventListener("mousedown", (e) => {
  isDown = true
  hasDragged = false
  categoriesTrack.classList.add("dragging")
  startX = e.pageX - categoriesTrack.offsetLeft
  scrollLeft = categoriesTrack.scrollLeft
})

document.addEventListener("mousemove", (e) => {
  if (!isDown || !categoriesTrack) return
  e.preventDefault()

  const xAmount = e.pageX - categoriesTrack.offsetLeft
  const walk = (xAmount - startX) * 1.5
  if (Math.abs(xAmount - startX) > dragThreshold) {
    hasDragged = true
  }

  categoriesTrack.scrollLeft = scrollLeft - walk
  document.body.classList.add("dragging-global")
})

document.addEventListener("mouseup", () => {
  isDown = false
  categoriesTrack.classList.remove("dragging")
  document.body.classList.remove("dragging-global")
})

categoriesTrack.addEventListener("click", (e) => {
  if (hasDragged) {
    e.preventDefault()
    e.stopImmediatePropagation()
  }
})

// Sort Button: Expand + stagger options on sort button click
const sortButton = document.querySelector(".sort-button")
const sortExpandedMenu = document.querySelector(".sort-expanded-menu")
const sortButtons = Array.from(sortExpandedMenu.querySelectorAll("li button"))

function sortExpandStagger() {
  sortExpandedMenu.classList.add("hide")

  requestAnimationFrame(() => {
    let finished = 0

    const onEnd = (e) => {
      if (e.propertyName !== "opacity") return
      finished += 1
      if (finished === sortButtons.length) {
        sortExpandedMenu.classList.remove("hide", "show")
        sortButtons.forEach((btn) =>
          btn.removeEventListener("transitionend", onEnd),
        )
      }
    }

    sortButtons.forEach((btn) =>
      btn.addEventListener("transitionend", onEnd, { once: false }),
    )
  })
}

// Sort Button: Add active class & call expand function
sortButton.addEventListener("click", () => {
  const isShowing = sortExpandedMenu.classList.contains("show")

  if (isShowing) {
    sortButton.classList.remove("active")
    sortExpandStagger()

    if (activeSort) {
      activeSort = null
      // Reset sort on sort button close
      sortButtons.forEach((b) => b.classList.remove("active"))

      // Respect user's category selection
      const activeCategory = document.querySelector(
        ".categories-btn.active",
      ).textContent
      let filtered

      if (activeCategory === "ALL") {
        filtered = content
      } else {
        filtered = content.filter(
          (e) => e.category.toUpperCase() === activeCategory,
        )
      }

      const resetSorted = sortContent(filtered, "newest")
      renderContent(resetSorted, grid)
    }
  } else {
    sortExpandedMenu.classList.remove("hide")
    sortButton.classList.add("active")
    sortExpandedMenu.classList.add("show")
  }
})

// Sort Content Helper Function
function sortContent(cards, type) {
  const sorted = [...cards]

  switch (type) {
    case "newest":
      sorted.sort((a, b) => new Date(b.date) - new Date(a.date))
      break
    case "oldest":
      sorted.sort((a, b) => new Date(a.date) - new Date(b.date))
      break
    case "az":
      sorted.sort((a, b) => a.title.localeCompare(b.title))
      break
    case "za":
      sorted.sort((a, b) => b.title.localeCompare(a.title))
      break
  }

  return sorted
}

// Event listener on sort buttons
let activeSort = null

sortButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const sortSelection = btn.dataset.sort
    activeSort = sortSelection

    sortButtons.forEach((b) => b.classList.remove("active"))
    btn.classList.add("active")

    // Respect user's category selection
    const activeCategory = document.querySelector(
      ".categories-btn.active",
    ).textContent
    let filtered

    if (activeCategory === "ALL") {
      filtered = content
    } else {
      filtered = content.filter(
        (e) => e.category.toUpperCase() === activeCategory,
      )
    }

    const sorted = sortContent(filtered, sortSelection)
    renderContent(sorted, grid)
  })
})

// Search Functionality
// Remove default submit behavior on Enter
const searchForm = document.querySelector(".filter-track-search")
searchForm.addEventListener("submit", (e) => {
  e.preventDefault()
})

const searchInput = document.querySelector(".search-input")

searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim().toLowerCase()
  // Optimize user input for matching

  content.forEach((item, index) => {
    // Grid order matches content array
    const card = grid.children[index]
    // Optimize JSON data for matching
    const title = (item.title || "").toLowerCase().trim()
    const category = (item.category || "").toLowerCase().trim()
    const matches = title.includes(query) || category.includes(query)

    if (matches) {
      showCard(card)
    } else {
      hideCard(card)
    }
  })
})

function showCard(card) {
  if (card.style.display === "none") {
    card.style.display = ""
    requestAnimationFrame(() => card.classList.remove("hidden"))
  } else {
    card.classList.remove("hidden")
  }
}

function hideCard(card) {
  if (card.classList.contains("hidden")) return

  card.classList.add("hidden")
  // Wait till done animating then remove from grid
  card.addEventListener(
    "transitionend",
    () => {
      if (card.classList.contains("hidden")) {
        card.style.display = "none"
      }
    },
    { once: true },
  )
}

// Card Counter Widget Observer
let cardsInViewport = new Set()
const gridCounterWidgetText = document.querySelector(
  ".grid-items-counter-widget",
)

const cardCounterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const card = entry.target

      // Check if card is hidden by search
      if (card.style.display === "none") return

      const rect = card.getBoundingClientRect()

      if (entry.isIntersecting) {
        // If card is entering viewport, add it to count
        cardsInViewport.add(card)
      } else if (rect.top > window.innerHeight) {
        // If card is below viewport, remove it from count
        cardsInViewport.delete(card)
      }
    })

    updateGridCounterDisplay()
  },
  {
    threshold: 0,
    rootMargin: "0px 0px 0px 0px",
  },
)

function updateGridCounterDisplay() {
  const visibleInViewportCount = cardsInViewport.size
  const totalCount = currentCards.length

  const gridCounterWidget = document.querySelector(".grid-items-counter-widget")

  if (gridCounterWidget) {
    // Remove existing count paragraph if it exists
    const existingCount = gridCounterWidget.querySelector(".counter-display")
    if (existingCount) {
      existingCount.remove()
    }

    // Create new paragraph with count
    const countParagraph = document.createElement("p")
    countParagraph.className = "counter-display"
    countParagraph.textContent = `${visibleInViewportCount} / ${totalCount}`

    // Insert at the beginning
    gridCounterWidget.insertBefore(countParagraph, gridCounterWidget.firstChild)
  }
}

function updateGridCounter() {
  // Re-observe all visible cards
  const allCards = grid.querySelectorAll(".content-card")

  allCards.forEach((card) => {
    cardCounterObserver.unobserve(card)
    if (card.style.display !== "none") {
      cardCounterObserver.observe(card)
    }
  })

  updateGridCounterDisplay()
}

// Observer to add "active" classes to Filter Track and Card Counter Widget
const filterTrack = document.querySelector(".filter-track")
const gridContainer = document.querySelector(".content-grid-container")
const gridCounterWidget = document.querySelector(
  ".grid-items-counter-widget-container",
)

const stickyObserver = new IntersectionObserver(
  ([entry]) => {
    const containerTop = entry.boundingClientRect.top
    const filterTop = filterTrack.getBoundingClientRect().top

    // Add active class to filter-track when it reaches 60px from top
    if (filterTop <= 60 && entry.isIntersecting) {
      filterTrack.classList.add("active")
    } else if (containerTop > 60) {
      filterTrack.classList.remove("active")
    }

    // Add active class to grid counter widget when filter-track reaches 200px from top
    if (filterTop <= 200 && entry.isIntersecting) {
      gridCounterWidget.classList.add("active")
    } else if (containerTop > 200) {
      gridCounterWidget.classList.remove("active")
    }
  },
  {
    threshold: Array.from({ length: 100 }, (_, index) => index / 100),
    rootMargin: "0px",
  },
)

stickyObserver.observe(gridContainer)
