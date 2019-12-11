import Vue from 'vue'

const setup = ({title, subtitle, overlay}) => {
    overlay.querySelector('.title').innerText = title
    overlay.querySelector('.subtitle').innerText = subtitle
}

const start = ({page, overlay}) => {
    console.log('$loadingOverlay: starting')
    page.style.display = 'none'
    overlay.style.display = 'flex'
}
const finish = ({page, overlay}) => {
    console.log('$loadingOverlay: finishing')
    overlay.style.display = 'none'
    page.style.display = 'block'
}

Vue.prototype.$loadingOverlay = async (asyncFunc, { title, subtitle }) => {
    title = title || "Chargement..."
    subtitle = subtitle || (title ? "Chargement..." : "Veuillez patienter")
    const page = document.getElementById('page')
    const overlay = document.getElementById('loading-state')
    setup({overlay, title, subtitle})
    start({page, overlay})
    await asyncFunc()
    finish({page, overlay})
}
