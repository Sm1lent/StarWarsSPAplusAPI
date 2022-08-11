function fetchJson(url) {
  return fetch(url).then(res => res.json())
}

function toggleSpinner() {
  document.body.classList.toggle('await')
}

export async function getEpisodeData(index) {
  toggleSpinner()
  Promise.all([
    fetchJson(`https://swapi.dev/api/films/${index}`)]).then(
    ([data]) => {
      render(data)
    }
  )
}

function render(data) {
  let arrayOfPlanets = [];
  let arrayOfSpecies = [];
  let arrayOfStarships = [];
  const episodeIntro = data.opening_crawl;
  const episodeTitle = data.title;
  const episodeID = data.episode_id
  Promise.all([
    Promise.all(
      data.planets.map(planet => fetch(planet).then(planet => planet.json()))).then((planets) => {
        planets.forEach(element => {
          arrayOfPlanets.push(element.name);
        });
      },
    ),
    Promise.all(
      data.species.map(kind => fetch(kind).then(kind => kind.json()))).then((species) => {
        species.forEach(element => {
          arrayOfSpecies.push(element.name);
        });
      },
    ),
    Promise.all(
      data.starships.map(starship => fetch(starship).then(starship => starship.json()))).then((starships) => {
        starships.forEach(element => {
          arrayOfStarships.push(element.name);
        });
      },
    )
  ]).then(() => {
    displayEpisodePage({episodeID, episodeTitle, episodeIntro, arrayOfPlanets, arrayOfSpecies, arrayOfStarships});
    toggleSpinner()
  })
}

export function displayEpisodePage({episodeID, episodeTitle, episodeIntro, arrayOfPlanets, arrayOfSpecies, arrayOfStarships}) {
  const contentBlock = document.getElementById('sw-base')

  removePageContent(contentBlock)
  createHeader({episodeID, episodeTitle})

  let intro = document.createElement('p')
  intro.classList.add('intro')
  intro.textContent = episodeIntro
  contentBlock.append(intro)

  let homeBtn = document.createElement('button')

  homeBtn.classList.add('btn-home')
  homeBtn.textContent = 'Back to episodes'
  contentBlock.append(homeBtn)
  homeBtn.addEventListener('click', () => {
    document.location.hash = ''
  })

  let episodeObjectsList = document.createElement('ul')
  episodeObjectsList.classList.add('episode-object-list')

  createEpisodeObjectsListItem(arrayOfPlanets, 'Planets:')
  createEpisodeObjectsListItem(arrayOfSpecies, 'Species:')
  createEpisodeObjectsListItem(arrayOfStarships, 'Starships:')
  contentBlock.append(episodeObjectsList)

  function createEpisodeObjectsListItem(list, name) {

    let episodeObjectsListItem = document.createElement('li')
    episodeObjectsListItem.classList.add('episode-object-list__item')

    let episodeObjectsTitle = document.createElement('h2')
    episodeObjectsTitle.classList.add('episode-object-list__obj-title')
    episodeObjectsTitle.textContent = name
    episodeObjectsListItem.append(episodeObjectsTitle)

    let objectsList = document.createElement('ul')
    objectsList.classList.add('episode-object-list__inner-list')


    if (list.length > 0) {
      for (let item of list) {
        let element = document.createElement('li')
        element.classList.add('episode-object-list__element')
        element.textContent = item
        objectsList.append(element)
      }
    } else {
      let element = document.createElement('li')
      element.classList.add('episode-object-list__element')
      element.textContent = 'No matches found'.
      objectsList.append(element)
    }
    episodeObjectsList.append(episodeObjectsListItem)
    episodeObjectsListItem.append(objectsList)
  }
}

function createHeader({episodeID, episodeTitle}) {
  const header = document.createElement('h1')
  if (episodeID) {
    header.textContent = `Episode ${episodeID}. ${episodeTitle}`
  } else {
    header.textContent = 'Эпизоды звёздных войн'
  }
  header.classList.add('main-title')
  document.getElementById('sw-base').append(header)
}

function removePageContent(blockToClear) {
  blockToClear.innerHTML = ''
}

let cssPromise = null;

export function importCss(){
  if (!cssPromise) {
    const link = document.createElement('link')
    link.rel = 'stylesheet';
    link.href = './css/episode.css'
    cssPromise = new Promise(resolve => {
      link.addEventListener('load', () => resolve())
    })
    document.head.append(link)
  }
  return cssPromise
}
