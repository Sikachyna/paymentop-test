import {ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit} from '@angular/core';
import {
  MatList,
  MatListItem,
  MatListItemAvatar, MatListItemMeta,
  MatNavList,
  MatSelectionList
} from "@angular/material/list";
import {BooksService} from '../../services/books.service';
import {Book} from '../../models/book';
import {MatLine} from '@angular/material/core';
import {NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {BookViewComponent} from '../book-view/book-view.component';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {DeleteConfirmation} from '../delete-confirmation/delete-confirmation.component';
import {Subscription} from 'rxjs';
import {SearchBarComponent} from './search-bar/search-bar.component';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [
    MatSelectionList,
    MatLine,
    NgOptimizedImage,
    MatIconButton,
    MatIcon,
    NgForOf,
    BookViewComponent,
    MatList,
    MatListItem,
    MatNavList,
    MatListItemAvatar,
    MatListItemMeta,
    NgIf,
    SearchBarComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.scss'
})
export class BookListComponent implements OnInit, OnDestroy {
  books: Book[] = [];
  filteredBooks: Book[] | null = null;
  bookSubscription: Subscription;
  lastSearchTerm: string;
  readonly dialog = inject(MatDialog);
  private readonly cdr = inject(ChangeDetectorRef);
  private viewDialogRef: MatDialogRef<BookViewComponent, any> | null = null;

  constructor(
    private booksService: BooksService,
  ) {
  }

  ngOnInit() {
    this.getBooks();
  }

  ngOnDestroy() {
    this.bookSubscription.unsubscribe();
  }

  get isShowBooks(): boolean {
    return (this.books.length > 0 && this.filteredBooks === null) || (this.filteredBooks !== null && this.filteredBooks.length > 0);
  }

  getBooks(): void {
    this.bookSubscription = this.booksService.getBookList().subscribe(books => {
      this.books = books;
      if (this.filteredBooks) {
        this.onSearch(this.lastSearchTerm);
      }
      this.cdr.markForCheck();
    });
  }

  selectBook(id: number): void {
    this.viewDialogRef = this.dialog.open(BookViewComponent, {
      width: '600px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      disableClose: true,
      data: {
        isEdit: false,
        isAddBook: false,
        book: this.books.find(book => book.id === id),
        onUpdate: (book: Book) => {
          this.doUpdateBook(book);
        },
        onDelete: (bookId: number) => {
          this.deleteBook(null, bookId);
        },
      }
    });
    this.viewDialogRef.afterClosed().subscribe((bookId) => {
        if (bookId) {
          this.viewDialogRef = null;
        }
      }
    );
  }

  deleteBook($event: Event | null, id: number): void {
    if ($event) {
      $event.stopPropagation();
    }
    const dialogRef = this.dialog.open(DeleteConfirmation, {
      width: '250px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      disableClose: true,
      data: {
        bookId: id,
        bookTitle: this.books.find(book => book.id === id)?.title
      }
    });
    dialogRef.afterClosed().subscribe(bookId => {
      if (bookId) {
        this.doDeleteBook(bookId);
        if (this.viewDialogRef) {
          this.viewDialogRef.close(bookId);
        }
        this.cdr.markForCheck();
      }
    });
  }

  doDeleteBook(bookId: number): void {
    this.booksService.deleteBook(bookId).subscribe((isSuccess: boolean) => {
      if (isSuccess) {
        this.getBooks();
      }
    });
  }

  doUpdateBook(book: Book): void {
    this.booksService.updateBook(book).subscribe((isSuccess: boolean) => {
      if (isSuccess) {
        this.getBooks();
      }
    });
  }

  detectChanges(): void {
    this.getBooks();
  }

  onSearch(searchTerm: string): void {
    if (searchTerm) {
      this.lastSearchTerm = searchTerm;
      this.filteredBooks = this.books.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else {
      this.filteredBooks = null;
    }
    this.cdr.markForCheck();
  }

}
