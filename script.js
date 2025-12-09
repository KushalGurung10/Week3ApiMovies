const API_URL = "http://localhost:3000/movies";

const movieListDiv = document.getElementById("movie-list");
const searchInput = document.getElementById("search-input");
const form = document.getElementById("add-movie-form");

let allMovies = []; // full movie list

function renderMovies(moviesToShow) {
    movieListDiv.innerHTML = "";

    if (moviesToShow.length === 0) {
        movieListDiv.innerHTML = "<p>No movies found.</p>";
        return;
    }

    moviesToShow.forEach(movie => {
        const div = document.createElement("div");
        div.classList.add("movie-item");

        div.innerHTML = `
            <p><strong>${movie.title}</strong> (${movie.year}) - ${movie.genre}</p>
            <button onclick="editMoviePrompt('${movie.id}', '${movie.title}', '${movie.year}', '${movie.genre}')">Edit</button>

            <button onclick="deleteMovie('${movie.id}')">Delete</button>
        `;

        movieListDiv.appendChild(div);
    });
}

function fetchMovies() {
    fetch(API_URL)
        .then(res => res.json())
        .then(data => {
            allMovies = data;
            renderMovies(allMovies);
        })
        .catch(err => console.error("Error:", err));
}

fetchMovies(); // Load on start

searchInput.addEventListener("input", () => {
    const term = searchInput.value.toLowerCase();

    const filtered = allMovies.filter(movie =>
        movie.title.toLowerCase().includes(term) ||
        movie.genre.toLowerCase().includes(term)
    );

    renderMovies(filtered);
});

form.addEventListener("submit", e => {
    e.preventDefault();

    const newMovie = {
        title: document.getElementById("title").value,
        genre: document.getElementById("genre").value,
        year: parseInt(document.getElementById("year").value)
    };

    fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMovie)
    })
        .then(res => res.json())
        .then(() => {
            form.reset();
            fetchMovies();
        })
        .catch(err => console.error("Add error:", err));
});

function editMoviePrompt(id, oldTitle, oldYear, oldGenre) {
    const newTitle = prompt("New Title:", oldTitle);
    const newYear = prompt("New Year:", oldYear);
    const newGenre = prompt("New Genre:", oldGenre);

    if (newTitle && newYear && newGenre) {
        const updatedMovie = {
            id,
            title: newTitle,
            year: parseInt(newYear),
            genre: newGenre
        };

        updateMovie(id, updatedMovie);
    }
}

function updateMovie(id, updatedData) {
    fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData)
    })
        .then(res => res.json())
        .then(() => fetchMovies())
        .catch(err => console.error("Update error:", err));
}

function deleteMovie(id) {
    if (!id) {
        console.error("Movie has no ID — cannot delete");
        return;
    }

    fetch(`${API_URL}/${id}`, {
        method: "DELETE",
    })
        .then(res => {
            if (!res.ok) throw new Error("Delete failed");
            fetchMovies();
        })
        .catch(err => console.error("Error deleting:", err));
}
