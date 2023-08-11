import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

// console.dir(axios);
// console.dir(Notify);

const BASE_URL = "https://pixabay.com/api/";
const API_KEY = "38704294-b9169c0a05cb876a56f757da2";

const form = document.querySelector('.search-form');


form.addEventListener('submit', handlerForm);

function handlerForm(evt) {
    evt.preventDefault();
    const searchImage = evt.currentTarget.searchQuery.value;
    // getImages(searchImage);
}

async function getImages(searchImage) {
    try {
        const resp = await axios.get(`${BASE_URL}`,
            {
            params: {
                key: API_KEY,
                q: searchImage,
                image_type: "photo",
                orientation: "horizontal",
                safesearch: true,
            }
            }
        );
        const data = resp.json();
        return data;
    } catch (error) {
        console.log("Помилка TryCatch")
    }       
    
};

    

 
getImages()
    .then(data => console.log(data))
    .catch((e) =>
        Notify.failure("Sorry, there are no images matching your search query. Please try again.")
        
        );

// console.log(form);