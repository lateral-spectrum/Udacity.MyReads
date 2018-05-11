const api_url = "https://reactnd-books-api.udacity.com"
const axios = require("axios");
// Generate a unique token for storing your bookshelf data on the backend server.
let token = localStorage.token
if (!token)
    token = localStorage.token = Math.random().toString(36).substr(-8)

const headers = {
    'Accept': 'application/json',
    'Authorization': token
};

export const BooksAPI = {

    getBookById: (id) => {
        return new Promise(async (resolve, reject) => {
            try {
                let req_response = axios.get(`${api_url}/books/${id}`, headers)
                let d = await req_response;
                let book = d.data;
                resolve(book);
            }
            catch (ex) {
                reject(ex);
            }
        });
    },
    getAllBooks: () => {
        return new Promise(async (resolve, reject) => {
            try {
                let req_response = axios.get(`${api_url}/books`, headers)
                let d = await req_response;
                let all_books = d.data.books;
                resolve(all_books);
            }
            catch (ex) {
                reject(ex);
            }
        });
    },
    updateBookshelf: (book_id, shelf) => {
        return new Promise(async (resolve, reject) => {
            try {
                let req_response = axios.put(`${api_url}/books/${book_id}`);
                let d = await req_response;
                let book = d.data;
                resolve(book);
            }
            catch (ex) {
                reject(ex);
            }
        });
        // fetch(`${api_url}/books/${bookId}`, {
        //     method: "PUT",
        //     headers: {
        //         ...headers,
        //         "Content-Type": "application/json"
        //     }
        // })
    }
};

//
// export const get = (bookId) =>
//     fetch(`${api}/books/${bookId}`, { headers })
//         .then(res => res.json())
//         .then(data => data.book)
//
// export const getAll = () =>
//     fetch(`${api}/books`, { headers })
//         .then(res => res.json())
//         .then(data => data.books)
//
// export const update = (book, shelf) =>
//     fetch(`${api}/books/${book.id}`, {
//         method: 'PUT',
//         headers: {
//             ...headers,
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ shelf })
//     }).then(res => res.json())
//
// export const search = (query) =>
//     fetch(`${api}/search`, {
//         method: 'POST',
//         headers: {
//             ...headers,
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ query })
//     }).then(res => res.json())
//         .then(data => data.books)