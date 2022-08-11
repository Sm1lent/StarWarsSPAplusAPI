import {displayEpisodes, getEpisodes} from './episodes-list.js';
(async ()=> {
  toggleSpinner()
  const episodesData = await getEpisodes()
  const episodesList = episodesData.results

  window.addEventListener('popstate', async () => {
    const episodeEditionNumber = document.location.hash.slice(1)
    if (!episodeEditionNumber) {
      displayEpisodes(episodesList)
    } else {
      const {getEpisodeData, importCss} = await import('./solo-episode.js')
      importCss()
      getEpisodeData(episodeEditionNumber)
    }
  })

  window.addEventListener('hashchange', async (e) => {
    const episodeEditionNumber = document.location.hash.slice(1)
    if (!episodeEditionNumber) {
      displayEpisodes(episodesList)
    } else {
      const {getEpisodeData, importCss} = await import('./solo-episode.js')
      importCss()
      getEpisodeData(episodeEditionNumber)
    }
  })

  displayEpisodes(episodesList)
  toggleSpinner()

})();

function toggleSpinner() {
  document.body.classList.toggle('await')
}


