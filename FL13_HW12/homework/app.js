const root = document.getElementById('root');

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
    this._books = StorageService.get(); // TODO: сделать умный загрузчик, который проверяет есть ли в локал сторидж или нет
    if (!this._books) {
      this._books = books;
    }
    return this._books;
  },

  getAllBooks() { // Просто возвращает массив всех книг
    return this._books;
  },

  getBookById(id) {
    return this._books[id];
  },

  addABook(book) {
    book.id = this.getAllBooks().length;;
    this.getAllBooks().push(book);
    // TODO: add to local storage
    StorageService.save(this.getAllBooks());
    return book.id;
  },

  editBook(book) {
    const currentBook = this.getAllBooks()[book.id];
    // const currentBook = this._books[book.id];
    if (currentBook) {
      currentBook.title = book.title;
      currentBook.author = book.author;
      currentBook.imageUrl = book.imageUrl;
      currentBook.plot = book.plot;
    }
    // console.log(currentBook)
    StorageService.save(this.getAllBooks());
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
    this._books = BookService.loadBooks();
    // TODO: ???????????????
    this._render();
  }

  refresh() {
    this._books = BookService.getAllBooks();
    this._render();
  }

  _render() {
    // TODO: assign onAddClick through on (subscribe and emit)
    this._element.innerHTML = `
      <h2>Book List</h2>
      <ul class="book-list">
        ${ this._books.map(book => `
              <li data-book-id="${ book.id }">
                <a href="?id=${ book.id }#preview">
                  ${book.title}
                </a> 
                <button onClick=location.href="${location.pathname}?id=${ book.id }#edit">Edit</button>
              </li>
           `).join('') 
        }
      </ul>
      <button type="button" data-component="add-button" onClick=location.href="${location.pathname}#add">
        Add
      </button>
    `;
  }
}

class BookPreview extends Component{
  constructor({ element }) {
    super({ element });
    // this._render();
  }

  show(bookId) {
    this._book =  BookService.getBookById(bookId);
    if (!this._book) {
      this.hide();
      return;
    }
    super.show();
    this._render();
  }

  _render() {
    this._element.innerHTML =  `
        <h2>Book Preview</h2>
        <ul>
          <li>
            <label>Book name:
              <input type="text" disabled value="${this._book.title}">
            </label>
          </li>
          <li>
            <label>Author:
              <input type="text" disabled value="${this._book.author}">
            </label>
          </li>
          <li>
            <label>Image Url:
              <input type="url" disabled value="${this._book.imageUrl}">
            </label>
          </li>
          <li>
            <label>Plot:
              <textarea disabled rows="10" cols="50">
                ${this._book.plot}
              </textarea>
            </label>
          </li>
        </ul>
    `;
  }
}

class BookEdit extends Component{
  constructor({ element }) {
    super({ element });
    // this._render();

    this.on('click', 'cancel-btn', (event) => {
      this.emit('click-on-cancel-btn');
    });

    this.on('click', 'save-btn', (event) => {
      const bookEdit = event.target.closest('[data-component="book-edit"]');
      const ul = bookEdit.querySelector('[data-book-id]');
      const book = {
        id: ul.dataset.bookId,
        title: ul.querySelector('[data-input="book-name"]').value,
        author: ul.querySelector('[data-input="book-author"]').value,
        imageUrl: ul.querySelector('[data-input="book-image-url"]').value,
        plot: ul.querySelector('[data-input="book-plot"]').value
      }
      this.emit('edit-book', book);
    });

  }

  show(bookId) {
    this._book =  BookService.getBookById(bookId);
    if (!this._book) {
      this.hide();
      return;
    }
    super.show();
    this._render();
  }

  _render() {
    this._element.innerHTML = `
        <h2>Book Edit</h2>
        <div data-component="book-edit">
        <ul data-book-id="${ this._book.id }">
          <li>
            <label>Book name:
              <input type="text" data-input="book-name" required value="${this._book.title}">
            </label>
          </li>
          <li>
            <label>Author:
              <input type="text" data-input="book-author" required value="${this._book.author}">
            </label>
          </li>
          <li>
            <label>Image Url:
              <input type="url" data-input="book-image-url" required value="${this._book.imageUrl}">
            </label>
          </li>
          <li>
            <label>Plot:
              <textarea rows="10" cols="50" required data-input="book-plot">
                ${this._book.plot}
              </textarea>
            </label>
          </li>
        </ul>
        <button data-component="cancel-btn">Cancel</button>
        <button data-component="save-btn">Save</button>
        </div>
    `;
  }

}

class BookAdd extends Component{
  constructor({ element }) {
    super({ element });

    // TODO: do I need it????????????
    // this._render();

    this.on('click', 'cancel-btn', (event) => {
      this.emit('click-on-cancel-btn');
    });

    this.on('click', 'save-btn', (event) => {
      const bookEdit = event.target.closest('[data-component="book-add"]');
      const ul = bookEdit.querySelector('[data-book-id]');
      const book = {
        id: -1,
        title: ul.querySelector('[data-input="book-name"]').value,
        author: ul.querySelector('[data-input="book-author"]').value,
        imageUrl: ul.querySelector('[data-input="book-image-url"]').value,
        plot: ul.querySelector('[data-input="book-plot"]').value
      }
      this.emit('add-new-book', book);
      console.log('in save')
    });
  }

  show() {
    super.show();
    this._render();
  }

  _render() {
    // TODO: добавил форму, но не помогла
    this._element.innerHTML =  `
        <h2>Book Add</h2>
        <div data-component="book-add">
        <form action="#">
        <ul data-book-id="new-book">
          <li>
            <label>Book name:
              <input type="text" data-input="book-name" required>
            </label>
          </li>
          <li>
            <label>Author:
              <input type="text" data-input="book-author" required>
            </label>
          </li>
          <li>
            <label>Image Url:
              <input type="url" data-input="book-image-url" required>
            </label>
          </li>
          <li>
            <label>Plot:
              <textarea rows="10" cols="50" data-input="book-plot" required>
                
              </textarea>
            </label>
          </li>
        </ul>
        <button data-component="cancel-btn">Cancel</button>
        <button data-component="save-btn" type="submit">Save</button>
        </form>
        </div>
    `;
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
    window.addEventListener('load', this.updateView);
    window.addEventListener('hashchange', this.updateView);
  }

  _initBookList() {
    this._bookList = new BookList({
      element: document.querySelector('[data-component="book-list"]')
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

    this._bookEdit.subscribe('edit-book', (book) => {
      console.log(book);
      BookService.editBook(book);
      console.log(books)
      this._bookList.refresh();
      this._bookPreview.show(book.id);
      this._bookEdit.hide();
      window.history.pushState(null, null, `?id=${book.id}#preview`);
      // TODO: Book successfully updated in 300ms
      setTimeout(() => alert('Book successfully updated'), 300);
    });

    this._bookEdit.subscribe('click-on-cancel-btn', () => {
      // console.log('click-on-cancel-btn ');
      if (confirm('Discard changes')) {
        // console.log('yes');
        history.back();
      }
    });
  }

  _initBookAdd() {
    this._bookAdd = new BookAdd({
      element: document.querySelector('[data-component="book-add-form"]')
    });
    this._bookAdd.hide();

    this._bookAdd.subscribe('add-new-book', (book) => {
      console.log(book);
      const id = BookService.addABook(book);
      // console.log(books)
      this._bookList.refresh();
      this._bookPreview.show(id);
      this._bookAdd.hide();
      window.history.pushState(null, null, `?id=${id}#preview`);
      // TODO: Book successfully updated in 300ms  -- ???????????????
      // setTimeout(() => alert('Book successfully updated'), 300);
    });

    this._bookAdd.subscribe('click-on-cancel-btn', () => {
      // console.log('click-on-cancel-btn ');
      if (confirm('Discard changes')) {
        // console.log('yes');
        history.back();
      }
    });
  }

  _getId = search => {
    const id = search.match(/id=/g);
    if (!id || id.length > 1) {
      return null;
    }
    return search.slice(4);
  }

  updateView = () => {
    const mode = location.hash.slice(1);
    const search = location.search; // TODO: сделать чтобы отслеживала ошибки
    const phoneId = this._getId(search);
    // console.log("on load "+mode + ' ' + search);
    // TODO: здесь подписаться на ивенты add edit preview На них не получится через on только через subscribe и emit
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

  _render() {
    this._element.innerHTML = `
    <div class="book-app">
      <div data-component="book-list"></div>
      <hr>
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