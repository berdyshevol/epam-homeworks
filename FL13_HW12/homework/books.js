const books = [
  {
    id: '0',
    title:
      'Eloquent Javascript',
    author:
      'Marijn Haverbeke',
    imageUrl:
      'https://images-na.ssl-images-amazon.com/images/I/51MSWCvCmcL._SX377_BO1,204,203,200_.jpg',
    plot:
      'You start by learning the basic structure of the JavaScript language as well'+
      ' as control structures, functions, and data structures to help you write basic programs.'+
      ' Then you\'ll learn about error handling and bug fixing, modularity, and asynchronous' +
      ' programming before moving on to web browsers and how JavaScript is used to program them.' +
      ' As you build projects such as an artificial life simulation, a simple programming language, and a paint program'
  },
  {
    id: '1',
    title: 'You Dont Know JS',
    author: 'Kyle Simpson',
    imageUrl: 'https://d2sofvawe08yqg.cloudfront.net/ydkjsy-get-started/hero2x?1580587360',
    plot: 'It seems like there\'s never been as much widespread desire before to learn JS.'+
      ' But with a million blogs, books, and videos out there, just where do you start?\n' +
      '\n' +
      'Get Started prepares you for the journey ahead, first surveying the language then'+
      ' detailing how the rest of the You Don\'t Know JS Yet book series guides you to knowing JS more deeply.'
  },
  {
    id: '2',
    title: 'High Performance Browser Networking',
    author: 'Ilya Grigorik',
    imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/51tSl2hh5UL._SX379_BO1,204,203,200_.jpg',
    plot: 'Author Ilya Grigorik, a web performance engineer at Google, demonstrates'+
      'performance optimization best practices for TCP, UDP, and TLS protocols, and'+
      ' explains unique wireless and mobile network optimization requirements.'+
      ' You’ll then dive into performance characteristics of technologies such as HTTP 2.0,'+
      ' client-side network scripting with XHR, real-time streaming with SSE and WebSocket,'+
      ' and P2P communication with WebRTC.'
  }
];

localStorage.setItem('book-list-app-books-from-books.js', JSON.stringify(books));
