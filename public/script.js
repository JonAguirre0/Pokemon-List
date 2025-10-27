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
    } else {

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