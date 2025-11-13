const main = document.querySelector('.main')
const series = document.querySelector('.option1')
const sets = document.querySelector('.option2')
const search = document.querySelector('.option3')
const searchInput = document.querySelector('.search')
const title = document.querySelector('.title')
const account = document.querySelector('.account')
const offScreenSideMenu = document.querySelector('.off-screen-side-menu')
const signIn = document.querySelector('.signIn')
const signInForm = document.querySelector('.signInForm')
const createAccountForm = document.querySelector('.createAccountForm')
const logOut = document.querySelector('.logOut')
const signInSubmit = document.querySelector('.submit')
const signUpSubmit = document.querySelector('.signUp')
const favorites = document.querySelector('.favorites')
//const usernameTitleError = document.querySelector('.usernameTitleError')
const createAccountLink = document.querySelector('.createAccountLink')
const closeSignInForm = document.querySelector('.closeSignInForm')
const closeCreateAccountForm = document.querySelector('.closeCreateAccountForm')

let isSets = false
let isSeries = false
let selectedCard = null
localStorage.removeItem('token')

window.onload = function loading() {
    setTimeout(function() {
        document.getElementById('loader').style.display = 'none'
    }, 999)
}

async function fetchAndDisplay(type, extraParams = {}) {
    main.innerHTML = ''
    token = localStorage.getItem('token')
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

    if(token !== null) {
        document.querySelectorAll('.overview').forEach(addCardBtn => {
            addCardBtn.style.display = 'flex'
        })
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
        const {image, id, name} = card

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
                <i class="fa-solid fa-circle-plus addCard" id=addCard data-id="${id}" data-image="${image}" data-name="${name}"></i>
                <i class="fa-solid fa-circle-minus delCard" id=delCard data-id="${id}" data-image="${image}" data-name="${name}" style="display: none;"></i>
            </div> 
        `
        main.appendChild(cardEl)
    })
}

title.addEventListener('click', () => {
    searchInput.value = ''
    //window.location.reload()
    token = localStorage.getItem('token')
    main.innerHTML = `
        <div class="homePage">
            <img class="img1" src="https://assets.tcgdex.net/en/base/base1/logo.png">
            <img class="img2" src="./images/img1.png">
        </div>
    `
    if(token !== null){
        document.querySelectorAll('.overview').forEach(addCardBtn => {
            addCardBtn.style.display = 'flex'
        })
    }
})

account.addEventListener('click', () => {
    offScreenSideMenu.classList.toggle('active')
    // if(offScreenSideMenu.classList.contains('active')){
    //     offScreenSideMenu.classList.remove('active')
    //     offScreenSideMenu.classList.add('exit')
    // } else {
    //     offScreenSideMenu.classList.remove('exit')
    //     offScreenSideMenu.classList.add('active')
    // }
})

createAccountLink.addEventListener('click', () => {
    signInForm.style.display = 'none'
    createAccountForm.style.display = 'flex'
})

closeSignInForm.addEventListener('click', () => {
    signInForm.style.display = 'none'
    main.classList.toggle('blur')
    document.querySelector('.username').value = ''
    document.querySelector('.password').value = ''
})

signIn.addEventListener('click', () => {
    signInForm.style.display = 'flex'
    offScreenSideMenu.classList.toggle('active')
    main.classList.toggle('blur')
})

signInSubmit.addEventListener('click', () => {
    const username = document.querySelector('.username').value
    const password = document.querySelector('.password').value
    logInPost(username, password)
    document.querySelector('.username').value = ''
    document.querySelector('.password').value = ''
})

async function logInPost(username, password) {
    const signInUsernameTitleError = document.querySelector('.signInUsernameTitleError')
    try {
        const res = await fetch('/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username, password})
        })
        const data = await res.json()
        if(!res.ok){
            signInUsernameTitleError.textContent = data.error
        } else {
            signInUsernameTitleError.textContent = ''
            alert('Login Successfull')
            localStorage.setItem('token', data.token)
            signIn.style.display = 'none'
            logOut.style.display = 'block'
            logOut.innerHTML = `Log Out, ${username}`
            favorites.style.display = 'block'
            favorites.innerHTML = `${username}'s Favorites`
            account.innerHTML = `<i class="fa-solid fa-circle-user" id="userIcon"></i>${username}`
            signInForm.style.display = 'none'
            main.classList.toggle('blur')
            document.querySelectorAll('.overview').forEach(addCardBtn => {
                addCardBtn.style.display = 'flex'
            })
        }
    } catch(error) {
        signInUsernameTitleError.textContent = 'Error, LogIn Unsuccessful'
    }
}

logOut.addEventListener('click', async() => {
    const res = await fetch('/logout', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username, email, password})
    })
    if(!res.ok) {
        alert('Error Logging Out')
    } else {
        localStorage.removeItem('token')
        logOut.style.display = 'none'
        favorites.style.display = 'none'
        signIn.style.display = 'block'
        offScreenSideMenu.classList.toggle('active')
        account.innerHTML = '<i class="fa-solid fa-circle-user" id="userIcon"></i> Account'
        searchInput.value = ''
        alert('Log Out Successful')
        document.querySelectorAll('.overview').forEach(addCardBtn => {
            addCardBtn.style.display = 'none'
        })
        main.innerHTML = `
            <div class="homePage">
                <img class="img1" src="https://assets.tcgdex.net/en/base/base1/logo.png">
                <img class="img2" src="./images/img1.png">
            </div>
        `
    }
})

closeCreateAccountForm.addEventListener('click', () => {
    createAccountForm.style.display = 'none'
    main.classList.toggle('blur')
    document.querySelector('.caUsername').value = ''
    document.querySelector('.caPassword').value = ''
    document.querySelector('.email').value = ''
})

async function signUpPost(username, email, password) {
    const createAccountUsernameTitleError = document.querySelector('.createAccountUsernameTitleError')
    try {
        const res = await fetch('/register', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username, email, password})
        })
        const data = await res.json()
        if(!res.ok) {
            createAccountUsernameTitleError.textContent = data.error
        } else {
            createAccountUsernameTitleError.textContent = ''
            alert('Registration Successful')
            createAccountForm.style.display = 'none'
            main.classList.toggle('blur')
            account.innerHTML = `<i class="fa-solid fa-circle-user" id="userIcon"></i>${username}`
        }
    } catch(error) {
        createAccountUsernameTitleError.textContent = 'Error, Registration Unsuccessful'
    }
}

signUpSubmit.addEventListener('click', () => {
    const username = document.querySelector('.caUsername').value
    const email = document.querySelector('.email').value
    const password = document.querySelector('.caPassword').value
    console.log(username, email, password)
    signUpPost(username, email, password)
    document.querySelector('.caUsername').value = ''
    document.querySelector('.caPassword').value = ''
    document.querySelector('.email').value = ''
})

favorites.addEventListener('click', async() => {
    main.innerHTML = ''
    offScreenSideMenu.classList.toggle('active')
    const token = localStorage.getItem('token')

    const res = await fetch('/favoritesList', {
        method: 'GET',
        headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
    })
    const data = await res.json()
    showCards(data.favorites)
    document.querySelectorAll('.overview').forEach(overview => {
        overview.style.display = 'flex'
        const addCard = overview.querySelectorAll('.addCard')
        addCard.forEach(card => {
            card.style.display = 'none'
        })
        const delCard = overview.querySelectorAll('.delCard')
        delCard.forEach(card => {
            card.style.display = 'flex'
        })
    })
})

document.addEventListener('click', async function (e) {
    const addCardBtn = e.target.closest('.addCard')

    if(addCardBtn) {
        selectedCard = {
            id: addCardBtn.dataset.id,
            image: addCardBtn.dataset.image,
            name: addCardBtn.dataset.name,
        }
    
        console.log(selectedCard)

        const token = localStorage.getItem('token')
        const res = await fetch('/favorites', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(selectedCard)
        })
        console.log('Card Added to Favorites')
        return res.json()
    }
})

//NEED TO ADD FUNCTION TO DEL CARDS FROM THE USERS ACCOUNT