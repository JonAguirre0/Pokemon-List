const main = document.querySelector('.main')
const series = document.querySelector('.option1')
const sets = document.querySelector('.option2')
const search = document.querySelector('.search')

let isSets = false
let isSeries = false

async function fetchAndDisplay() {
    main.innerHTML = ''
    const res = await fetch(`/${type}`)
    const data = await res.json() 

    if(type === 'sets') {
        showSets(data)
    } else if(type === 'series'){
        showSeries(data)
    }
}

function showSets(sets) {
    sets.forEach((set) => {
        const {name, logo} = set

        if (!logo) return

        const setEl = document.createElement('div')
        setEl.classList.add('sets')
        setEl.innerHTML = `
            <div class="set">
                <img src="${logo}.png">
                <div class="setName">${name}</div>
            </div>
        `
        main.appendChild(setEl)
    })
}

sets.addEventListener('click', () => {
    isSets = true
    type = 'sets'
    fetchAndDisplay(type)
})

function showSeries(series) {
    series.forEach((series) => {
        const {name, logo} = series

        if(!logo) return

        const seriesEl = document.createElement('div')
        seriesEl.classList.add('series')
        seriesEl.innerHTML = `
            <div class="serie">
                <img src="${logo}.png">
                <div class="serieName">${name}</div>
            </div>
        `
        main.appendChild(seriesEl)
    })
}

series.addEventListener('click', () => {
    isSeries = true
    type = 'series'
    fetchAndDisplay(type)
})