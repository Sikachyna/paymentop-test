import {Injectable} from '@angular/core';
import {map, Observable, Observer, of} from 'rxjs';
import {Book} from '../models/book';
import books from '../mockups/books.mockup.json';

@Injectable({
  providedIn: 'root'
})
export class BooksService {
  books: Book[] = books;
  pathToCovers = "https://sikachyna.com/tmp/book-covers/";

  constructor() {
  }

  getBookList(): Observable<Book[]> {
    return of(this.books).pipe(
      map(books => books.map(book => {
        if (!book.cover.includes('http://') && !book.cover.includes('https://')) {
          book.cover = `${this.pathToCovers}${book.cover}`;
        }
        return book;
      }))
    );
  }

  deleteBook(bookId: number): Observable<boolean> {
    return new Observable((observer: Observer<boolean>) => {
      const index = this.books.findIndex(book => book.id === bookId);
      if (index !== -1) {
        this.books.splice(index, 1);
        observer.next(true);
      } else {
        observer.next(false);
      }
      observer.complete();
    });
  }

  updateBook(book: Book): Observable<boolean> {
    return new Observable((observer: Observer<boolean>) => {
      const index = this.books.findIndex(b => b.id === book.id);
      if (index !== -1) {
        this.books[index] = book;
        observer.next(true);
      } else {
        observer.next(false);
      }
      observer.complete();
    });
  }

  addBook(book: Book): Observable<boolean> {
    return new Observable((observer: Observer<boolean>) => {
      book.id = this.getNextId();
      this.books.push(book);
      observer.next(true);
      observer.complete();
    });
  }

  getNextId(): number {
    return this.books.reduce((max, book) => book.id > max ? book.id : max, 0) + 1;
  }
}
