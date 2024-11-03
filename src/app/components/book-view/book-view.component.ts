import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardImage, MatCardSubtitle,
  MatCardTitle
} from '@angular/material/card';
import {Book} from '../../models/book';
import {MatButton, MatIconButton} from '@angular/material/button';
import {NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {MAT_DIALOG_DATA, MatDialogClose, MatDialogRef} from '@angular/material/dialog';
import {MatIcon} from '@angular/material/icon';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatInput} from '@angular/material/input';
import {MatOption, MatSelect} from '@angular/material/select';
import genres from '../../mockups/genres.mockup.json';

@Component({
  selector: 'app-book-view',
  standalone: true,
  imports: [
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardActions,
    MatButton,
    NgOptimizedImage,
    MatCardImage,
    MatCardTitle,
    MatCardSubtitle,
    NgIf,
    NgForOf,
    MatIcon,
    MatDialogClose,
    MatFormField,
    ReactiveFormsModule,
    MatInput,
    MatLabel,
    MatSelect,
    MatOption,
    MatIconButton
  ],
  templateUrl: './book-view.component.html',
  styleUrl: './book-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class BookViewComponent implements OnInit {
  bookForm: FormGroup;
  genres = genres;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      book: Book,
      isEdit: boolean,
      isAddBook: boolean,
      onUpdate: (book: Book) => void,
      onDelete: (bookId: number) => void,
    },
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<BookViewComponent>
  ) {
  }

  ngOnInit(): void {
    if (this.data.isAddBook) {
      this.data.isEdit = true;
    }
    this.bookForm = this.fb.group({
      title: [this.data.book.title, Validators.required],
      author: [this.data.book.author, Validators.required],
      year: [this.data.book.year, Validators.required],
      genre: [this.data.book.genre, Validators.required],
      publisher: [this.data.book.publisher, Validators.required],
      isbn: [this.data.book.isbn, Validators.required],
      description: [this.data.book.description, Validators.required],
      rating: [this.data.book.rating, [Validators.required, Validators.min(1), Validators.max(5)]],
      cover: [this.data.book.cover, [Validators.required, Validators.pattern('https?://.+')]],
    });
  }

  getStars(rating: number): string[] {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(i < rating ? 'star' : 'star_border');
    }
    return stars;
  }

  getGenreTitle(genreId: number): string {
    const title = this.genres.find(genre => genre.id === genreId)?.title;
    return title ? title : 'unknown';
  }

  editBook(): void {
    this.data.isEdit = true;
  }

  cancelEdit(): void {
    if (this.data.isAddBook) {
      this.dialogRef.close();
    } else {
      this.bookForm.patchValue({
        title: this.data.book.title,
        author: this.data.book.author,
        year: this.data.book.year,
        genre: this.data.book.genre,
        publisher: this.data.book.publisher,
        isbn: this.data.book.isbn,
        cover: this.data.book.cover,
        description: this.data.book.description,
        rating: this.data.book.rating
      });
    }
    this.data.isEdit = false;
  }

  saveBook(): void {
    if (this.bookForm.valid) {
      const updatedBook: Book = this.bookForm.value;
      updatedBook.id = this.data.book.id;
      this.data.book = updatedBook;
      this.data.isEdit = false;
      this.data.onUpdate(updatedBook);
    }
  }

  deleteBook(): void {
    this.data.onDelete(this.data.book.id);
  }

}
