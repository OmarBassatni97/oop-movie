//the API documentation site https://developers.themoviedb.org/3/
const container = document.getElementById("container");
const backgroundDiv = document.createElement("div");
const form = document.getElementById('form')
const search = document.getElementById('search')
backgroundDiv.innerHTML = `
<div class='home-background'>
<div class='home-background--text'>
<h1>Welcome to your Movie Guide</h1>
<p>Start hovering over the popular movies for more details!</p>
</div>
</div>
`;
backgroundDiv.classList.add("backgroundDiv");
container.appendChild(backgroundDiv);
this.form.addEventListener('submit', (e) => {
  e.preventDefault()
  console.log('hello from search')
  const searchTerm = this.search.value
  if (searchTerm) {
    APIService.fetchMoviesWithSearch(APIService.searchURL + '&query=' + searchTerm)
  }
  else {
    const movies = APIService.fetchMovies();
    HomePage.renderMovies(movies)
  }

})
class App {
  static async run() {
    const movies = await APIService.fetchMovies();
    console.log(movies)
    HomePage.renderMovies(movies);
  }
  static async runAboutPage() {
    AboutPage.renderAbout();
}
}

class APIService {
  static TMDB_BASE_URL = "https://api.themoviedb.org/3";
  static API_KEY = 'api_key=862271aa285e74d61113b31d525420b4'
  static searchURL = this.TMDB_BASE_URL + '/search/movie?' + this.API_KEY
  static async fetchMovies() {
    const url = APIService._constructUrl(`movie/now_playing`);
    const response = await fetch(url);
    const data = await response.json();
    return data.results.map((movie) => new Movie(movie));
  }
  static fetchMoviesWithSearch(url) {
    fetch(url).then(res => res.json()).then(data => {
      console.log(data.results)
      SearchPage.showSearchedMovies(data.results)
    })
  }
  static async fetchMovie(movieId) {
    const url = APIService._constructUrl(`movie/${movieId}`);
    const response = await fetch(url);
    const data = await response.json();
    return new Movie(data);
  }

  static async fetchActors(movieData) {
    movieData.cast.forEach(async (cast, index) => {
      if (index > 5) return;

      const url = APIService._constructUrl(`/person/${cast.id}`);
      const response = await fetch(url);
      const data = await response.json();

      return data.results.map((actor) => new Actor(actor));
    });
  }

  static async fetchActor(actorId) {
    const url = APIService._constructUrl(`/person/${actorId}`);
    const response = await fetch(url);
    const data = await response.json();

    return new Actor(data);
  }

  static _constructUrl(path) {
    return `${this.TMDB_BASE_URL
      }/${path}?${this.API_KEY}`; //remember to encode and decode it using ../atob
  }
}

class HomePage {
  static container = document.getElementById("container");
  static moviesDiv = document.createElement("div");

  static renderBackgroundMovie(movie) {
    backgroundDiv.innerHTML = `
    <div class='backgroundTextDiv'>
    <h1>${movie.title}</h1>
    <p>${movie.overview}</p>
    </div>
    <img src=${movie.backdropUrl} alt='movie-image'>



    
    `;
  }
  static renderMovies(movies) {
    movies.forEach((movie) => {
      const movieDiv = document.createElement("div");
      const movieTextDiv = document.createElement('div')
      movieTextDiv.classList.add('movie-text-div')
      const movieImage = document.createElement("img");
      const movieRating = document.createElement('span')
      movieRating.innerHTML = `<i class="bx bxs-star"></i>${movie.rating}`
      movieImage.src = `${movie.backdropUrl}`;
      const movieTitle = document.createElement("p");
      movieTitle.textContent = `${movie.title}`;
      movieTextDiv.appendChild(movieTitle)
      movieTextDiv.appendChild(movieRating)
      movieImage.addEventListener("click", function () {
        Movies.run(movie);
      });

      movieDiv.appendChild(movieTextDiv);
      movieImage.addEventListener("mouseover", (e) => {
        e.preventDefault();
        this.renderBackgroundMovie(movie);
      });
      movieDiv.classList.add("movieDiv");
      this.moviesDiv.classList.add("moviesDiv");
      movieDiv.appendChild(movieImage);
      this.container.appendChild(movieDiv);
      this.moviesDiv.appendChild(movieDiv);
      this.container.appendChild(this.moviesDiv);
    });
    const scrollForMore = document.createElement("div");
    scrollForMore.classList.add("scroll-for-more");
    scrollForMore.innerHTML = `<p>Scroll to the right for more</p>`;
    this.container.appendChild(scrollForMore);
  }
}

class Movies {
  static async run(movie) {
    const movieData = await APIService.fetchMovie(movie.id);
    MoviePage.renderMovieSection(movieData);
    APIService.fetchActors(movieData.cast);
  }
}

class MoviePage {
  static container = document.getElementById("container");

  static renderMovieSection(movie) {
    MovieSection.renderMovie(movie);
  }
}

class Actors {
  static async run(actor) {
    const actorData = await APIService.fetchActor(actor.id);
    ActorPage.renderActorSection(actorData);
  }
}

class ActorPage {
  static container = document.getElementById("container");
  static renderActorSection(actor) {
    ActorSection.renderActor(actor);
  }
}
class ActorSection {
  static renderActor(actor) {
    ActorPage.container.innerHTML = `
    <main>
    <article>

      <!-- 
        - #MOVIE DETAIL
      -->

      <section class="movie-detail">
        <div class="container">

          <figure class="movie-detail-banner">

            <img src="https://www.themoviedb.org/t/p/original/${
              actor.profilePicture
            }" alt="profile picture">

          

          </figure>

          <div class="movie-detail-content">


            <h1 class="h1 detail-title">
              ${actor.name
                .split(" ")
                .slice(0, -1)
                .join(" ")} <strong> ${actor.name
      .split(" ")
      .slice(-1)
      .join(" ")}</strong>
            </h1>

            <div class="meta-wrapper">

              <div class="badge-wrapper">
                <div class="badge badge-fill"> ${actor.gender}</div>

                <div class="badge badge-outline"><i class="fa-regular fa-star"></i> ${
                  actor.popularity
                }</div>
              </div>

              <div class="ganre-wrapper">
                <a href="#">Comedy,</a>

                <a href="#">Action,</a>

                <a href="#">Adventure,</a>

                <a href="#">Science Fiction</a>
              </div>

              <div class="date-time">

                <div>
                  <ion-icon name="calendar-outline"></ion-icon>

                  <time datetime="2021">Birthdate</time>
                </div>

                <div>
                  <ion-icon name="time-outline"></ion-icon>

                  <time datetime="PT115M"> ${actor.birthday}</time>
                </div>

              </div>

            </div>

            <p class="storyline">
             ${actor.biography}
            </p>

           

        </div>
      </section>
   
      <!-- 
      - #TV SERIES
    -->

    <section class="tv-series">
      <div class="container">


        <h2 class="h2 section-title">Movies Acted In</h2>

        <ul class="movies-list">

          <li>
            <div class="movie-card">

              <a href="./movie-details.html">
                <figure class="card-banner">
                  <img src="https://www.themoviedb.org/t/p/original/${
                    actor.profilePicture
                  }" alt="Moon Knight movie poster">
                </figure>
              </a>

              <div class="title-wrapper">
                <a href="./movie-details.html">
                  <h3 class="card-title">Moon Knight</h3>
                </a>

                <time datetime="2022">2022</time>
              </div>

              <div class="card-meta">
                <div class="badge badge-outline">2K</div>

                <div class="duration">
                  <ion-icon name="time-outline"></ion-icon>

                  <time datetime="PT47M">47 min</time>
                </div>

                <div class="rating">
                  <ion-icon name="star"></ion-icon>

                  <data>8.6</data>
                </div>
              </div>

            </div>
          </li>

          

        </ul>

      </div>
    </section>
    
    `;
  }
}
class SearchPage {
  static container = document.getElementById("container");
  static IMG_URL = 'https://image.tmdb.org/t/p/w500';
  static showSearchedMovies(data) {
    this.container.innerHTML = ''
    this.container.classList.add('searched-movies-container')
    data.forEach((movie) => {
      const { title, poster_path, vote_average, overview } = movie;
      const movieEl = document.createElement('div');
      movieEl.classList.add('movie');
      movieEl.innerHTML = `
             <img src="${this.IMG_URL + poster_path}" alt="${title}">
            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${this.getColor(vote_average)}">${vote_average}</span>
            </div>
            <div class="overview">
                <h3>Overview</h3>
                ${overview}
            </div>
        
        `
      movieEl.addEventListener("click", function () {
        Movies.run(movie);
      });
      this.container.appendChild(movieEl);
      console.log('we are in showSearchedMovies')

    })
  }
  static getColor(vote) {
    if (vote >= 8) {
      return 'green'
    } else if (vote >= 5) {
      return "orange"
    } else {
      return 'red'
    }
  }


}


class AboutPage {
  static container = document.getElementById("container");
  static renderAbout() {
      ActorPage.container.innerHTML = `
  
    <div class="row d-flex justify-content-center p-5">
    <div class="container-fluid d-flex justify-content-center p-2">
    <h2 style="font-weight: bold;"> About Us</h2>
    </div>
    <div class="container-fluid d-flex justify-content-center p-2">
    <h3>The Easiest Part Of the Project</h3>
    </div>
    <div class="container-fluid d-flex justify-content-center p-2">
    <h3>After all the<b class="font-weight-bold text-danger"> struggle! </b> </h3>
    </div>
    <div class="container-fluid d-flex justify-content-center p-2 font-italic ">
    <h3>Perry couldn't push nor pull, Reem couldn't share screen on discord!</h3>
    </div>
    <div class="container-fluid d-flex justify-content-center p-2">
    <h3>And yet we came up with this <b class="font-weight-bold" style="color:green;"> Result! </b></h3>
    </div>
    <div class="container-fluid d-flex justify-content-center p-2">
    <p>Coded and Designed for Re:Coded Front End 2022 Bootcamp</p>
    </div>
  </div>
  
  `
  }
}

class MovieSection {
  static renderMovie(movie) {
    MoviePage.container.innerHTML = `
    <div style="position: fixed; left: 0; top: 0; width: 100%; height: 100%; background-color: blue; z-index: -1;">
    <img id="movieImage" src="${movie.backdropUrl}" width="" style="width: 100%; height: 100%;">
  </div>

  <header style="left: 10rem; top: 10rem; margin-top: 5rem; margin-left: 10rem;">
    <main style="max-width: 80%; background-color: rgba(0, 0, 0, 0.801); color: white; padding: 2rem; border-radius: 5px;">
        <h1 id="title" style="font-weight:bold; padding-bottom:10px;">
            ${movie.title}
        </h1>

        <p id="description">
            description   ${movie.overview}
        </p>

        <footer style="display: flex; border-image: linear-gradient(to bottom, turquoise, greenyellow) 0 1;">
            <ul style="list-style: none; padding: 0px;">
                <li style="display: flex; justify-items:start; align-items: flex-start;">
                    <aside id="runtime" style="margin-right: 10px;">
                        Duration  ${movie.runtime}

                    </aside>
        
                  <div style="display: flex; " >
                    <p>
                        Rating:   ${movie.rating}
                    </p>

                    <p id="rating" style="margin-left:10px;">
                        Release Date:   ${movie.releaseDate}
                    </p>
                    <p id="language" style="margin-left:10px;">
                        Language:   ${movie.language}
                    </p>
                    
                  </div>
                </li>

            </ul>
        </footer>
    </main>

   
</header>

<div style="margin-top: 3rem; width: 100%; display: flex; min-width: 90rem">
    <aside id="cast" style="width: 40%;">
        <ul id="members" style="list-style: none; display: flex; flex-wrap: wrap; gap:10px; margin-left:100px">
    
        </ul>
    </aside>

      <li id="member" style="font-size: 10px;display: none; width: 10rem; height: 10rem; margin: 5px;; border-radius: 5px; background-repeat: no-repeat; background-size: contain;">
                <div id="actor-name" style="max-width: 80%;   color: white; padding-top:160px; border-radius: 5px; font-size:13px; text-shadow: -1px 1px 0 #000,
                1px 1px 0 #000,
               1px -1px 0 #000,
              -1px -1px 0 #000;">
                    
                </div>
            </li>

    <main id="trailers" style="width: 30%; margin-left:180px;">
    </main>

    <aside id="similar-movies" style="width: 30%; display: flex; flex-wrap: wrap;">
        <div id="similar-movie" style="position: relative;;margin: 4px; border-radius: 10px;display: none;width: 40%; min-height: 10rem;background-repeat: no-repeat; background-size: cover; background-image: url(https://images.hindustantimes.com/img/2021/08/26/550x309/144b7a0179da2184143146224238adb0_1621492205535_1629966593507.jpg);">
            <div style="background-color: rgba(0, 0, 0, 0.527); width: fit-content; height: fit-content; border-radius: 10px; position: absolute; bottom: 4px;">
                <p style="color: white; font-size: 10px;">
            
                </p>
            </div>
        </div>
    </aside>
</div>

      `;
  }
}
class Movie {
  static BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780";
  constructor(json) {
    this.id = json.id;
    this.title = json.title;
    this.releaseDate = json.release_date;
    this.runtime = json.runtime + " mins";
    this.rating = json.vote_average;
    this.overview = json.overview;
    this.backdropPath = json.backdrop_path;
    this.language = json.original_language;

    this.getCast();
    this.getTrailer();
  }
  

  async getCast() {
    const url = APIService._constructUrl(`/movie/${this.id}/credits`);
    const response = await fetch(url);
    const data = await response.json();

    this.director = await data.crew.filter(({ job }) => job === "Director")[0]
      .name;
    this.casts = data.cast;

    this.casts.forEach(async (cast, index) => {
      if (index > 5) return;

      const url = APIService._constructUrl(`/person/${cast.id}/images`);
      const response = await fetch(url);
      const data = await response.json();
      const image =
        data.profiles.length > 1 ? data.profiles[0].file_path : null;

      const member = document.getElementById("member").cloneNode(true);
      member.style.backgroundImage = `url("http://image.tmdb.org/t/p/w780/${image}")`;
      member.style.display = "flex";
      member.firstElementChild.innerHTML = cast.name;

      document.getElementById("members").appendChild(member);
      document.getElementById("actor-name").appendChild(member.firstElementChild.innerHTML = cast.name);
      member.addEventListener("click", () => {
        Actors.run(cast);
      });
    });
  }

  async getTrailer() {
    const url = APIService._constructUrl(`/movie/${this.id}/videos`);
    const response = await fetch(url);
    const data = await response.json();

    const trailer = data["results"][0].key;

    const trailerSection = document.getElementById("trailers");
    const trailerDiv = document.createElement("div");
    trailerDiv.style =
      "width: 100%; min-height: 15rem;background-repeat: no-repeat; background-size: contain;";

    // //Creating iframe
    const link = `https://www.youtube.com/embed/${trailer}`;
    const iframe = document.createElement("iframe");
    iframe.frameBorder = 0;
    iframe.width = "420px";
    iframe.height = "315px";
    iframe.setAttribute("src", link);

    trailerDiv.appendChild(iframe);
    trailerSection.appendChild(trailerDiv);
  }
  

  async getReleaseDate() {
    const url = APIService._constructUrl(`/movie/${this.id}/release_dates`);
    const response = await fetch(url);
    const data = await response.json();
  }
  async getNowPlaying() {
    const url = APIService._constructUrl(`/movie/now_playing`);
    const response = await fetch(url);
    const data = await response.json();
  }
  async getPopular() {
    const url = APIService._constructUrl(`/movie/popular`);
    const response = await fetch(url);
    const data = await response.json();
  }

  async getUpcoming() {
    const url = APIService._constructUrl(`/movie/top_rated`);
    const response = await fetch(url);
    const data = await response.json();
  }

  async getTopRated() {
    const url = APIService._constructUrl(`/movie/upcoming`);
    const response = await fetch(url);
    const data = await response.json();
  }

  get backdropUrl() {
    return this.backdropPath ? Movie.BACKDROP_BASE_URL + this.backdropPath : "";
  }
}


class Actor {
  constructor(json) {
    this.id = json.id;
    this.name = json.name;

    if (json.gender == 1) {
      this.gender = "female";
    } else {
      this.gender = "male";
    }
    this.profilePicture = json.profile_path;
    this.popularity = json.popularity;
    this.birthday = json.birthday;
    this.deathday = json.deathday;
    this.biography = json.biography;

    // A list of movies the actor participated in
    this.getMovies();
  }
  

  async getMovies() {
    const url = APIService._constructUrl(`/person/${this.id}/movie_credits`);
    const response = await fetch(url);

    const data = await response.json();

    this.movies = data;

    this.movies.forEach((movie) => {});
    // const movieData = await APIService.fetchMovie(movie.id);
    // MoviePage.renderMovieSection(movieData);
  }
}
const aboutButton = document.getElementById("about-page");
aboutButton.addEventListener("click", function () {
    MoviePage.container.innerHTML = ""
    App.runAboutPage();
})
document.addEventListener("DOMContentLoaded", App.run);
