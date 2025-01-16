const apiUrl = 'http://localhost:3000/books';

document.addEventListener('DOMContentLoaded', () => {
    fetchBooks();

    document.getElementById('bookForm').addEventListener('submit', (e) => {
        e.preventDefault();
        addBook();
    });
});

async function fetchBooks() {
    const response = await fetch(apiUrl);
    const books = await response.json();
    const bookList = document.getElementById('bookList');
    bookList.innerHTML = '';
    books.forEach(book => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.genre}</td>
            <td>${book.year}</td>
            <td class="actions">
                <button onclick="deleteBook('${book._id}')">Delete</button>
                <button onclick="updateBook('${book._id}', '${book.title}', '${book.author}', '${book.genre}', '${book.year}')
                ">Update</button>
            </td>
        `;
        bookList.appendChild(row);
    });
}

async function addBook() {
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const genre = document.getElementById('genre').value;
    const year = document.getElementById('year').value;

    const book = { title, author, genre, year };

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(book)
    });

    if (response.ok) {
        document.getElementById('bookForm').reset();
        fetchBooks();
    }
}

async function deleteBook(id) {
    const response = await fetch(`${apiUrl}/${id}`, {
        method: 'DELETE'
    });

    if (response.ok) {
        fetchBooks();
    }
}
async function updateBook(id, currentTitle, currentAuthor, currentGenre, currentYear) {
    const updatedTitle = prompt('Enter updated title:', currentTitle);
    const updatedAuthor = prompt('Enter updated author:', currentAuthor);
    const updatedGenre = prompt('Enter updated genre:', currentGenre);
    const updatedYear = prompt('Enter updated year:', currentYear);

    const updatedBook = { title: updatedTitle, author: updatedAuthor, genre: updatedGenre, year: updatedYear };

    const response = await fetch(`${apiUrl}/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedBook)
    });

    if (response.ok) {
        fetchBooks();
    }
}

