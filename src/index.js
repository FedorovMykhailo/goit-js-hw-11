import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import axios from 'axios';

const API_key = "37238562-5ffe15b4bded6c1d7bc3e5140";

let page = 1;
let q = "";
let totalHits=0;
let hits=0;
let gallery;

const refs = {
    form: document.querySelector(".search-form"),
    search: document.querySelector('[name="searchQuery"]'),
    gallery: document.querySelector(".gallery"),
    loadMoreButton: document.querySelector(".load-more"),
    sorry: document.querySelector(".sorry-end"),
}

const  renderGallery = (images) => {
const galeryMap = images.map((image)=>{
    return `<div class="photo-card" ><a href="${image.largeImageURL}" >
    <div class = "image-item">
    <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
    </div></a>
    <div class="info">
      <p class="info-item">
        <b> ❤️ Likes ${image.likes}</b> 
      </p>
      <p class="info-item">
        <b> 👁️ Views ${image.views}</b>
      </p>
      <p class="info-item">
        <b> ✍️ Comments ${image.comments}</b>
      </p>
      <p class="info-item">
        <b>📥Downloads ${image.downloads}</b>
      </p>
    </div>
  </div>`
})
refs.gallery.insertAdjacentHTML("beforeend",galeryMap.join("")) 
}

const countPage = () => {
    ++page;
}

const countHits = (dataHits) => {
    hits+=dataHits;
    countPage();
    if (hits >= totalHits) {
        showSorry();
        hideloadMoreButton();
    }
    else{
        showloadMoreButton();
    }
}

const clearPage = () => {
    page = 1;
    hits = 0;
    totalHits = 0;
}

const clearGallery = () => {
    while (refs.gallery.firstChild){
        refs.gallery.removeChild(refs.gallery.firstChild)
    }
    clearPage();
    hideSorry();
}
const scrrolGallery = () => {
  const { height: cardHeight } = document
  .querySelector(".gallery")
  .firstElementChild.getBoundingClientRect();
  
  window.scrollBy({
  top: cardHeight * 2.3,
  behavior: "smooth",
});

}
const showloadMoreButton = () => {
    refs.loadMoreButton.classList.add("visible")
}
const hideloadMoreButton = () => {
    refs.loadMoreButton.classList.remove("visible")
}
const showSorry = () => {
    refs.sorry.classList.add("visible")
}
const hideSorry = () => {
    refs.sorry.classList.remove("visible")
}

const onClickLoadMore = async () => {
    const url = `https://pixabay.com/api/?key=${API_key}&q=${q}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
    // const response = await fetch(url);
    // const data = await response.json();
    try {
        const responce = await axios.get(url);
        renderGallery(responce.data.hits);
        gallery.refresh();
        countHits(responce.data.hits.length);
        scrrolGallery();
    } catch (error) {
        console.error(error);
    }
}

const onSubmit = async (evt) => {
    evt.preventDefault();
    if (page >= 2) { clearGallery() }
    q = refs.search.value;
    const url = `https://pixabay.com/api/?key=${API_key}&q=${q}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`;
   // const response = await fetch(url);
   // const data = await response.json();
   try {
        const responce = await axios.get(url);
        if (responce.data.hits.length === 0) {
            hideloadMoreButton();
            Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.",{width: "710px", position: "center-top", fontSize:'20px',});}
        else {
            totalHits = responce.data.totalHits
            Notiflix.Notify.info(`Hooray! We found ${totalHits} images`,{width: "400px", position: "center-top", fontSize:'20px',})
            renderGallery(responce.data.hits);
            gallery = new SimpleLightbox('.gallery a');
            countHits(responce.data.hits.length);}
   } catch (error) {
        console.error(error);
   }
}

refs.form.addEventListener("submit", onSubmit)
refs.loadMoreButton.addEventListener("click", onClickLoadMore)


