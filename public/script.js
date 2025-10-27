const main = document.querySelector('.main')

function showSets(sets) {
    sets.forEach((set) => {
        const {name, logo} = set

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