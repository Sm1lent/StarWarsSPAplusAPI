async function fetchJson(url) {
 return fetch(url).then(res => res.json())
}

export async function getEpisodes() {
  return fetchJson('https://swapi.dev/api/films');
}

function createHeader({episode_id, title}=false) {
  const header = document.createElement('h1')
  if (episode_id) {
    header.textContent = `Episode ${episode_id}. ${title}`
  } else {
    header.textContent = 'Эпизоды звёздных войн'
  }
  header.classList.add('main-title')
  document.getElementById('sw-base').append(header)
}

function removePageContent(blockToClear) {
  blockToClear.innerHTML = ''
}

export async function displayEpisodes(filmsList) {
  const contentBlock = document.getElementById('sw-base')
  removePageContent(contentBlock)
  createHeader()

  const nav = document.createElement('nav')
  nav.classList.add('nav')
  contentBlock.append(nav)

  for (let episode of filmsList) {
    let index = episode.url.slice(-2, -1)
    const linkHash = `#${index}`
    let episodeLink = document.createElement('a')
    episodeLink.classList.add('nav__link', 'link')
    episodeLink.textContent = `${episode.title}`
    episodeLink.setAttribute('href', `#${index}`)
    nav.append(episodeLink)
    episodeLink.addEventListener('click', e =>{
      history.pushState(null, '', linkHash)
      document.location.hash = `#${index}`
    })
  }
}

