// const tracksEl = document.querySelector('.tracks')

class TrackList {
  // Creating our Class
  constructor(domSelector) {
    // Getting a domelement
    this.container = document.querySelector(domSelector)
    // Store my data
    this.data = null
    // Represents the currently displayed data
    this.viewData = null

    // Show stuff
    this.render()
  }

  template(data) {
    // Mapping over data and returning HTML String

    let tracks = data.map(track => `<div class="row" >
        <div><img src=${track.artworkUrl100} alt=""></div>
        <div>${track.trackName}</div>
        <div class="mediaquery">${track.artistName}</div>
        <div>${track.trackPrice} $</div>
        <div>
        <button onclick="myTrackList.playMusic(${track.trackId})">play</button>
  <button onclick="myTrackList.pauseMusic(${track.trackId})">pause</button>
  
  <audio  id=${track.trackId} controls="controls" style="display:none"></audio>
        </div>
      </div> `

    ).join('')
    return tracks
    // For now we just assume that all data is there and that it is
  }
  // create a methode to play the track
  playMusic(id) {
    this.viewData.map(ele => ele.trackId).forEach(song => this.pauseMusic(song))
    this.viewData.filter(song => {
      if (song.trackId == id) {
        let track = document.getElementById(id)
        track.setAttribute('src', song.previewUrl)
        track.play()
        this.setVolume()
      }
    })
  }
  // create a Methode to pause the track
  pauseMusic(id) {
    let song = document.getElementById(id)
    return song.pause()
  }
  // create a Methode to control the volume of the playing track
  setVolume() {
    let soundSize = document.getElementById('range')
    let songs = document.querySelectorAll('audio')
    songs.forEach(song => {
      if (!song.paused) { return song.volume = soundSize.value }
    })
  }
  // create a Methode to mute the playing track
  mute() {
    let soundSize = document.getElementById('range')
    soundSize.value = 0
    this.setVolume()
  }
  modViewData(newData) {
    this.viewData = newData
    this.render()
  }
  // Create a Methode to filter tracks by alphabet
  filter() {
    let filter = document.getElementById('input').value
    let inpText = filter.toUpperCase()

    let showTracks = this.data.filter(track => {

      let name = track.trackName.replace(/\s|&/gi, '').toUpperCase()
      let artist = track.artistName.replace(/\s|&/gi, '').toUpperCase()

      if (name.includes(inpText) || artist.includes(inpText)) { return track }
    })

    this.modViewData(showTracks)
  }

  updateData(data) {
    this.data = data

    this.viewData = data

    this.render()
  }
  defaultTemplate() {
    `<h1>My Tracks</h1>`
  }

  render() {
    // Out put will hold the complete view

    let output = ''

    // Setting up data for our view
    const header = '<h1>My Tracks</h1>'
    const topics = '<div class="row" id="sticky"><h1>Cover</h1><h1>Name </h1><h1>Artist </h1><h1>Price </h1><div><i class="fas fa-volume-up" onclick="myTrackList.mute()"></i><input type="range" min="0" max="1" value="1" step="0.01" id="range" onchange="myTrackList.setVolume()" class="volume" /></div></div>'
    // template methode accepts data to view and returns html string
    const template = this.viewData ? this.template(this.viewData) : this.defaultTemplate()
    // Adding data in to our view !Order Matters!
    output += header

    output += '<p>Data from iTunes</p>'
    output += topics
    output += template
    // Assinging view in to innerHTML of our domElement form the constructor
    this.container.innerHTML = output
  }
  // create a methode to filter viewed tracks by price,name and artist
  filterBySelect() {
    let value = document.getElementById('select').value
    switch (value) {
      case 'price':
        const listPrice = this.viewData.sort((a, b) => (a.trackPrice - b.trackPrice))
        this.modViewData(listPrice)
        break
      case 'name':
        let listName = this.viewData.sort(function (a, b) {
          let nameA = a.trackName
          let nameB = b.trackName
          if (nameA < nameB) {
            return -1
          }
          if (nameA > nameB) {
            return 1
          }
          return 0
        })
        this.modViewData(listName)
        break
      case 'artist':
        let listArtist = this.viewData.sort(function (a, b) {
          let nameA = a.artistName
          let nameB = b.artistName
          if (nameA < nameB) {
            return -1
          }
          if (nameA > nameB) {
            return 1
          }
          return 0
        })
        this.modViewData(listArtist)
      default:
        this.render()
        break
    }
  }

}

const myTrackList = new TrackList('#tracks')
// myTrackList.updateData(music)

function chooseArtist(url) {
  let inpArt = document.getElementById('artistName').value
  url = `https://dci-fbw12-search-itunes.now.sh/?term=${inpArt}`
  fetch(url)
    .then(response => {
      return response.json()
    }).then((data) => {
      myTrackList.updateData(data.results)
    })
    .catch(function (err) {
      alert('Something went wrong!', err)
    })
  if (inpArt == '') {
    url = 'https://dci-fbw12-search-itunes.now.sh/?term=pop'
    fetch(url)
      .then(response => {
        return response.json()
      }).then((data) => {
        myTrackList.updateData(data.results)
      })
      .catch(function (err) {
        alert('Something went wrong!', err)
      })
  }
}
let url = 'https://dci-fbw12-search-itunes.now.sh/?term=pop'
fetch(url)
  .then(response => {
    return response.json()
  }).then((data) => {
    myTrackList.updateData(data.results)
  })
  .catch(function (err) {
    alert('Something went wrong!', err)
  })
  // const req = new XMLHttpRequest()
  // req.open("GET", url, true)
  // req.responseType = "json"
  // req.onload = function() {
  //   var jsonResponse = req.response
  // 	console.log(jsonResponse)
  //   // do something with jsonResponse 
  //   myTrackList.updateData(jsonResponse.results)
  // }

  // req.send(null)
