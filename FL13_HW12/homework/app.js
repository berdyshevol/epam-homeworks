'use strict';

const root = document.getElementById('root');

const TIMEOUT = 300;

const StorageService = {
  _key: 'book-list-app-books',

  get() {
    const str = localStorage.getItem(this._key);
    if (str) {
      return JSON.parse(str);
    }
    return null;
  },

  save(value) {
    localStorage.setItem(this._key, JSON.stringify(value));
  }
}

const BookService = {
  loadBooks() {
    this._books = StorageService.get();
    if (!this._books) {
      this._books = JSON.parse(
        localStorage.getItem('book-list-app-books-from-books.js')
      );
    }
  },

  getAllBooks() {
    return this._books;
  },

  getBookById(id) {
    return this._books[id];
  },

  addABook(book) {
    book.id = this.getAllBooks().length;
    this.getAllBooks().push(book);
    StorageService.save(this.getAllBooks());
    return book.id;
  },

  editBook(book) {
    const currentBook = this.getAllBooks()[book.id];

    if (currentBook) {
      currentBook.title = book.title;
      currentBook.author = book.author;
      currentBook.imageUrl = book.imageUrl;
      currentBook.plot = book.plot;
    }
    StorageService.save(this.getAllBooks());
  }
};

const DOMService = {
  getBookFromElement(ul) {
    const book = {
      id: ul.dataset.bookId,
      title: ul.querySelector('[data-input="book-name"]').value,
      author: ul.querySelector('[data-input="book-author"]').value,
      imageUrl: ul.querySelector('[data-input="book-image-url"]').value,
      plot: ul.querySelector('[data-input="book-plot"]').value
    }
    return book;
  }
};

class Component {
  constructor({ element }) {
    this._element = element;
    this._callbackMap = {};
  }

  hide() {
    this._element.hidden = true;
  }

  show() {
    this._element.hidden = false;
  }

  on(eventName, elementName, callback) {
    this._element.addEventListener(eventName, (event) => {
      const delegateTarget = event.target.closest(`[data-component="${ elementName }"]`);

      if ( !delegateTarget || !this._element.contains(delegateTarget) ) {
        return;
      }

      callback(event);
    });
  }

  subscribe(eventName, callback) {
    if (!this._callbackMap[eventName]) {
      this._callbackMap[eventName] = [];
    }

    this._callbackMap[eventName].push(callback);
  }

  emit(eventName, data) {
    const eventCallbacks = this._callbackMap[eventName];

    if (!eventCallbacks) {
      return;
    }

    eventCallbacks.forEach(callback => {
      callback(data);
    });
  }
}

class BookList extends Component {
  constructor({ element }) {
    super({ element });
    BookService.loadBooks();

    this.refresh();

    this.on('click', 'edit-btn', (event) => {
      const bookId = event.target.dataset.bookId;
      this.emit('show-edit-form', bookId);
    });

    this.on('click', 'add-btn', () => {
      this.emit('show-add-form');
    });
  }

  refresh() {
    this._books = BookService.getAllBooks();
    this._render();
  }

  _render() {
    this._element.innerHTML = `
      <h2>Book List</h2>
      <ul class="book-list">
        ${ this._books.map(book => `
              <li data-book-id="${ book.id }">
                <a href="?id=${ book.id }#preview">
                  ${book.title}
                </a> 
                <button
                  data-book-id="${ book.id }"
                  data-component="edit-btn" 
                  
                >
                  Edit
                </button>
              </li>
           `).join('') 
        }
      </ul>
      <button type="button" data-component="add-btn" >
        Add
      </button>
    `;
  }
}

class BookForm extends Component {
  constructor({ element, header }) {
    super({ element });
    this._book = {
      id: '',
      title: '',
      author: '',
      imageUrl: '',
      plot: ''
    }
    this._header = header || '';
    this._render();
    this._listenAllButtons();
  }

  _listenAllButtons() {
    this.on('click', 'cancel-btn', (event) => {
      event.preventDefault();
      this.emit('click-on-cancel-btn');
    });

    this.on('submit', 'book-form', (event) => {
      event.preventDefault();
      const ul = [...this._element.getElementsByTagName('ul')][0];
      const book = DOMService.getBookFromElement(ul);
      this.emit('click-save-btn', book);
    });
  }

  _render() {
    this._element.innerHTML = `
      <h2>${ this._header }</h2>
      <form data-component="book-form" action="#" mathod="post">
        <ul class="form-ul" data-book-id="${ this._book.id }">
          <li>
            <label>Book name:
              <input type="text" data-input="book-name" value="${this._book.title}" required>
            </label>
          </li>
          <li>
            <label>Author:
              <input type="text" data-input="book-author" value="${this._book.author}" required>
            </label>
          </li>
          <li>
            <label class="url-label">Image Url:
              <input type="url" data-input="book-image-url" value="${this._book.imageUrl}" required>
            </label>
            <img class="url-img" src="${ this._book.imageUrl }" alt="${this._book.imageUrl}" height="100px" hidden>
          </li>
          <li>
            <label>Plot:
              <textarea rows="5" cols="50" 
                data-input="book-plot"
                placeholder="Please, input plot of the book"
                required
              >${this._book.plot}</textarea>
            </label>
          </li>
        </ul>
        <button data-component="cancel-btn" type="reset">Cancel</button>
        <button data-component="save-btn" type="submit">Save</button>
      </form>
    `;
  }

  fillForm(book) {
    this._book.id = book.id;
    this._book.title = book.title;
    this._book.author = book.author;
    this._book.imageUrl = book.imageUrl;
    this._book.plot = book.plot;
  }
}

class BookPreview extends BookForm {
  constructor({ element }) {
    super({ element, header: 'Book Preview'});
  }

  _disable() {
    this._element.querySelectorAll('input').forEach(input => {
      input.disabled = true
    });
    this._element.querySelector('textarea').disabled = true;
  }

  _hideButtons() {
    this._element.querySelectorAll('button').forEach(btn => {
      btn.hidden = true
    });
  }

  _showPic() {
    this._element.querySelector('.url-img').hidden = false;
    this._element.querySelector('.url-label').hidden = true;
  }

  _render() {
    super._render();
    this._disable();
    this._hideButtons();
    this._showPic();
  }

  show(bookId) {
    const book = BookService.getBookById(bookId);
    if (!book) {
      this.hide();
      return;
    }

    this.fillForm(book);
    this._render();
    super.show();
  }
}

class BookEdit extends BookForm {
  constructor({ element }) {
    super({ element, header: 'Edit Book' });
  }

  show(bookId) {
    const book = BookService.getBookById(bookId);
    if (!book) {
      this.hide();
      return;
    }

    this.fillForm(book);
    this._render();
    super.show();
  }
}

class BookAdd extends BookForm {
  constructor({ element }) {
    super({ element, header: 'Add Book' });
  }
}

class BooksPage {
  constructor({ element }) {
    this._element = element;
    this._render();
    this._initBookList();
    this._initBookPreview();
    this._initBookEdit();
    this._initBookAdd();
    this._listenToUrlChange();
  }

  _initBookList() {
    this._bookList = new BookList({
      element: document.querySelector('[data-component="book-list"]')
    });
    this._bookList.subscribe('show-edit-form', (bookId) => {
      location.href = `${location.pathname}?id=${ bookId }#edit`;
    });
    this._bookList.subscribe('show-add-form', () => {
      location.href = `${location.pathname}#add`;
    });
  }

  _initBookPreview() {
    this._bookPreview = new BookPreview({
      element: document.querySelector('[data-component="book-preview"]')
    });
    this._bookPreview.hide();
  }

  _initBookEdit() {
    this._bookEdit = new BookEdit({
      element: document.querySelector('[data-component="book-edit-form"]')
    });
    this._bookEdit.hide();

    this._bookEdit.subscribe('click-save-btn', (book) => {
      BookService.editBook(book);
      const id = book.id;
      this._reopenPage(id);
    });

    this._bookEdit.subscribe('click-on-cancel-btn', () => {
      if (confirm('Discard changes')) {
        history.back();
      }
    });
  }

  _initBookAdd() {
    this._bookAdd = new BookAdd({
      element: document.querySelector('[data-component="book-add-form"]')
    });
    this._bookAdd.hide();

    this._bookAdd.subscribe('click-save-btn', (book) => {
      const id = BookService.addABook(book);
      this._reopenPage(id);
    });

    this._bookAdd.subscribe('click-on-cancel-btn', () => {
      if (confirm('Discard changes')) {
        history.back();
      }
    });
  }

  _reopenPage(id) {
    location.href = `${location.pathname}?id=${ id }#preview`;
    setTimeout(() => alert('Book successfully updated'), TIMEOUT);
    this._bookList.refresh();
    this._bookPreview.show(id);
    this._bookEdit.hide();
    this._bookAdd.hide();
  }

  _getId(search) {
    const idPosition = 4;
    const id = search.match(/id=/g);
    if (!id || id.length > 1) {
      return null;
    }
    return search.slice(idPosition);
  }

  _listenToUrlChange() {
    const updateView = () => {
      const mode = location.hash.slice(1);
      const search = location.search;
      const phoneId = this._getId(search);

      this._bookList.refresh();

      if (mode === 'preview') {
        this._bookPreview.show(phoneId);
        this._bookAdd.hide();
        this._bookEdit.hide();
      } else if (mode === 'add') {
        this._bookPreview.hide();
        this._bookAdd.show();
        this._bookEdit.hide()
      } else if (mode === 'edit') {
        this._bookPreview.hide();
        this._bookAdd.hide();
        this._bookEdit.show(phoneId)
      } else {
        this._bookPreview.hide();
        this._bookAdd.hide();
        this._bookEdit.hide()
      }
    }
    window.addEventListener('load', updateView);
    window.addEventListener('hashchange', updateView);
  }

  _render() {
    this._element.innerHTML = `
    <div class="book-app">
      <div data-component="book-list"></div>
      <div data-component="book-preview"></div>
      <div data-component="book-edit-form"></div>
      <div data-component="book-add-form"></div>
    </div>
    `;
  }
}

let currentPage = new BooksPage({
  element: root
});