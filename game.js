// script.js

// Función para cargar vídeos desde el almacenamiento local
function cargarVideos() {
    // Obtener los vídeos de cada categoría desde el almacenamiento local
    let musica = JSON.parse(localStorage.getItem('musica')) || [];
    let aberrantes = JSON.parse(localStorage.getItem('aberrantes')) || [];
    let gilipolleces = JSON.parse(localStorage.getItem('gilipolleces')) || [];

    // Mostrar los vídeos en cada sección
    mostrarVideos(musica, 'musica');
    mostrarVideos(aberrantes, 'aberrantes');
    mostrarVideos(gilipolleces, 'gilipolleces');

    // Actualizar el ranking
    actualizarRanking();
}

// Función para mostrar vídeos en una sección
function mostrarVideos(videos, categoria) {
    let section = document.getElementById(categoria);
    section.innerHTML = ''; // Limpiar la sección antes de mostrar los vídeos

    videos.forEach((video, index) => {
        let div = document.createElement('div');
        div.innerHTML = `
            <h3>${video.nombre}</h3>
            <iframe width="560" height="315" src="${video.enlace}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            <div class="votacion">
                <button onclick="votar('${categoria}', '${video.nombre}', 1)">★</button>
                <button onclick="votar('${categoria}', '${video.nombre}', 2)">★</button>
                <button onclick="votar('${categoria}', '${video.nombre}', 3)">★</button>
                <button onclick="votar('${categoria}', '${video.nombre}', 4)">★</button>
                <button onclick="votar('${categoria}', '${video.nombre}', 5)">★</button>
            </div>
        `;
        section.appendChild(div);
    });
}

// Función para agregar un nuevo vídeo a una categoría
function agregarVideo(categoria) {
    let nombreInput = document.getElementById(`nombre${categoria.charAt(0).toUpperCase() + categoria.slice(1)}`);
    let enlaceInput = document.getElementById(`enlace${categoria.charAt(0).toUpperCase() + categoria.slice(1)}`);
    let nombre = nombreInput.value;
    let enlace = enlaceInput.value;
    if (nombre && enlace) {
        let videos = JSON.parse(localStorage.getItem(categoria)) || [];
        videos.push({ nombre: nombre, enlace: enlace });
        localStorage.setItem(categoria, JSON.stringify(videos));
        cargarVideos();
        nombreInput.value = '';
        enlaceInput.value = '';
    } else {
        alert('Por favor, complete todos los campos.');
    }
}

// Función para votar por un vídeo
function votar(categoria, nombreVideo, rating) {
    let votesKey = `${categoria}_${nombreVideo}_votes`;
    let votes = JSON.parse(localStorage.getItem(votesKey)) || [];
    let user = prompt('Introduce tu nombre:');
    if (user) {
        let vote = { user: user, rating: rating };
        votes.push(vote);
        localStorage.setItem(votesKey, JSON.stringify(votes));
        // Actualizar el ranking después de votar
        actualizarRanking();
    }
}

// Función para actualizar el ranking de vídeos más votados
function actualizarRanking() {
    let categorias = ['musica', 'aberrantes', 'gilipolleces'];
    categorias.forEach(categoria => {
        let videos = JSON.parse(localStorage.getItem(categoria)) || [];
        let rankingContainer = document.getElementById(`${categoria}_ranking`);
        rankingContainer.innerHTML = '<h2>Ranking</h2><ol>';
        videos.forEach(video => {
            let votesKey = `${categoria}_${video.nombre}_votes`;
            let votes = JSON.parse(localStorage.getItem(votesKey)) || [];
            let totalRating = 0;
            votes.forEach(vote => {
                totalRating += vote.rating;
            });
            let averageRating = totalRating > 0 ? (totalRating / votes.length).toFixed(2) : 'N/A';
            rankingContainer.innerHTML += `<li>${video.nombre}: ${averageRating} estrellas (${votes.length} votos)</li>`;
        });
        rankingContainer.innerHTML += '</ol>';
    });
}

// Función para iniciar la aplicación
function iniciarApp() {
    cargarVideos();
}

// Ejecutar la función iniciarApp cuando se cargue la página
document.addEventListener('DOMContentLoaded', iniciarApp);
