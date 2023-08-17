import axios from "axios";

export default async function getImages(reqest, page = 1) {
    const BASE_URL = "https://pixabay.com/api/";
    const API_KEY = "38704294-b9169c0a05cb876a56f757da2";
    const resp = await axios.get(BASE_URL,
        {
            params: {
                key: API_KEY,
                q: reqest,
                image_type: "photo",
                orientation: "horizontal",
                safesearch: true,
                page: page,
                per_page: 40,
            }
        }
            
    );
    return resp;          
    
};