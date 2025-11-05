const main = document.querySelector('.main')
const series = document.querySelector('.option1')
const sets = document.querySelector('.option2')
const search = document.querySelector('.option3')
const searchInput = document.querySelector('.search')
const title = document.querySelector('.title')
const account = document.querySelector('.account')

let isSets = false
let isSeries = false

window.onload = function loading() {
    setTimeout(function() {
        document.getElementById('loader').style.display = 'none'
    }, 999)
}

async function fetchAndDisplay(type, extraParams = {}) {
    main.innerHTML = ''
    const params = new URLSearchParams({...extraParams})
    const res = await fetch(`/${type}?${params}`)
    const data = await res.json() 

    if(type === 'sets') {
        showSets(data)
    } else if(type === 'series'){
        showSeries(data)
    } else if(type === 'search'){
        showCards(data)
    } else if (type === 'selectedSet'){
        showCards(data)
    } else if (type === 'selectedSeries'){
        showSets(data.data)
    }
}

function showSets(sets) {
    sets.forEach((set) => {
        const {name, logo, id} = set

        if (!logo) return

        const setEl = document.createElement('div')
        setEl.classList.add('sets')
        setEl.innerHTML = `
            <div class="set">
                <img src="${logo}.png">
                <div class="setName">${name}</div>
            </div>
        `
        setEl.addEventListener('click', () => {
            document.getElementById('loader').style.display = 'flex'
            type = 'selectedSet'
            currentParams = {set: id}
            fetchAndDisplay(type, currentParams).then(() => {
                setTimeout(function() {
                    document.getElementById('loader').style.display = 'none'
                }, 3555)
            })
        })

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
        const {name, logo, id} = series

        if(!logo) return

        const seriesEl = document.createElement('div')
        seriesEl.classList.add('series')
        seriesEl.innerHTML = `
            <div class="serie">
                <img src="${logo}.png">
                <div class="serieName">${name}</div>
            </div>
        `
        seriesEl.addEventListener('click', () => {
            type = 'selectedSeries'
            currentParams = {series: id}
            fetchAndDisplay(type, currentParams)
        })

        main.appendChild(seriesEl)
    })
}

series.addEventListener('click', () => {
    isSeries = true
    type = 'series'
    fetchAndDisplay(type)
})

search.addEventListener('submit', (e) => {
    document.getElementById('loader').style.display = 'flex'
    e.preventDefault()

    const searchTerm = searchInput.value
    console.log(searchTerm)
    type = 'search'

    if(searchTerm && searchTerm !== '') {
        type = 'search'
        currentParams = {search: searchTerm}
        fetchAndDisplay(type, currentParams).then(() => {
            setTimeout(function() {
                document.getElementById('loader').style.display = 'none'
            }, 3000)
        })
    }
})

function showCards(cards) {
    main.innerHTML = ''
    cards.forEach((card) => {
        const {image, id} = card

        if (!image) return

        const cardEl = document.createElement('div')
        // cardEl.classList.add('card')
        // cardEl.innerHTML = `
        //     <img src="${image}/high.png">
        //     <div class=cardID>${id}</div>
        //     <div class=cardID>${id}</div>
        // `
        cardEl.classList.add('cardSearch')
        cardEl.innerHTML = `
            <div class="cardS">
                <img src="${image}/high.png">
            </div>
            <div class="overview" style="display: none;">
                <i class="fa-solid fa-circle-plus addCard" id=addCard style="display: none;"></i>
                <i class="fa-solid fa-circle-minus delCard" id=delCard style="display: none;"></i>
            </div>
        `
        main.appendChild(cardEl)
    })
}

title.addEventListener('click', () => {
    searchInput.value = ''
    window.location.reload()
})

function showSignIn() {
    main.innerHTML = ''
    const signInEl = document.createElement('div')
    signInEl.classList.add('signInForm')
    signInEl.innerHTML = `
        <h3>Sign In</h3>
        <div class="inputs">
            <a class="usernameTitle">Username</a>
            <a class="usernameTitleError"></a>
            <input class="username" id="username" type="text" placeholder="Username">
            <a class="passwordTitle">Password</a>
            <input class="password" id="password" type="password" placeholder="Password">
        </div>
        <div class="buttons">
            <button class="submit" id="submit">Submit</button>
        </div>
        <div class="accountLink">
            <a class="textBeforeLink">Don't have an Account?</a>
            <a href="#" class="createAccountLink" id="createAccount">Create Account</a>
        </div>
    `
    main.appendChild(signInEl)

    const createAccountLink = document.querySelector('.createAccountLink')
    createAccountLink.addEventListener('click', () => {
        showCreateAccount()
    })
}


account.addEventListener('click', () => {
    showSignIn()
})

function showCreateAccount() {
    main.innerHTML = ''
    const accountEl = document.createElement('div')
    accountEl.classList.add('createAccountForm')
    accountEl.innerHTML = `
        <h3>Registration</h3>
        <div class="inputs">
            <a class="usernameTitle">Username</a>
            <a class="usernameTitleError"></a>
            <input class="username" id="username" type="text" placeholder="Username">
            <a class="passwordTitle">Password</a>
            <input class="password" id="password" type="password" placeholder="Password">
            <a class="emailTitle">Email</a>
            <input class="email" id="email" type="text" placeholder="Email">
        </div>
        <div class="button">
            <button class="signUp" id="signUp">Sign Up</button>
        </div>
    `
    main.appendChild(accountEl)
}