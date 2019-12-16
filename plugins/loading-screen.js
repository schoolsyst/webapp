import Vue from 'vue'

const setup = ({title, subtitle, screen}) => {
    screen.querySelector('.title').innerText = title
    screen.querySelector('.subtitle').innerText = subtitle
}

const start = ({page, screen}) => {
    console.log('$withLoadingScreen: starting')
    page.style.display = 'none'
    screen.style.display = 'flex'
}
const finish = ({page, screen}) => {
    console.log('$withLoadingScreen: finishing')
    screen.style.display = 'none'
    page.style.display = 'block'
}

Vue.prototype.$withLoadingScreen = async (asyncFunc, { title, subtitle }) => {
    title = title || "Chargement..."
    subtitle = subtitle || (title ? "Chargement..." : "Veuillez patienter")
    const page = document.getElementById('page')
    const screen = document.getElementById('loading-screen')
    setup({screen, title, subtitle})
    start({page, screen})
    await asyncFunc()
    finish({page, screen})
}
