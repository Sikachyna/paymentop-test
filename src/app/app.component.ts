import {Component, ViewChild} from '@angular/core';
import {MatButton, MatFabButton} from '@angular/material/button';
import {BookListComponent} from './components/book-list/book-list.component';
import {BookViewComponent} from './components/book-view/book-view.component';
import {MatIcon} from '@angular/material/icon';
import {MatDialog} from '@angular/material/dialog';
import {Book} from './models/book';
import {BooksService} from './services/books.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MatButton,
    BookListComponent,
    BookViewComponent,
    MatIcon,
    MatFabButton,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent {
  @ViewChild(BookListComponent) bookListComponent: BookListComponent;

  constructor(
    private dialog: MatDialog,
    private booksService: BooksService,
  ) {
  }

  addBook() {
    const newBook: Book = {
      id: 0,
      isbn: '',
      title: '',
      author: '',
      publisher: '',
      description: '',
      year: new Date().getFullYear(),
      genre: 0,
      rating: 0,
      cover: 'https://',
    };

    const dialogRef = this.dialog.open(BookViewComponent, {
      disableClose: true,
      data: {
        book: newBook,
        isAddBook: true,
        onUpdate: (book: Book) => {
          this.booksService.addBook(book).subscribe((isSuccess: boolean) => {
            if (isSuccess) {
              this.bookListComponent.detectChanges();
              dialogRef.close(book);
            }
          });
        }
      }
    });
  }
}
