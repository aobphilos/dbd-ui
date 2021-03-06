import { Component, OnInit, forwardRef } from '@angular/core';
import { CategoryService } from '../../../core/category.service';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { Subject } from 'rxjs';

const CUSTOM_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CategorySelectComponent),
  multi: true
};

@Component({
  selector: 'app-category-select',
  templateUrl: './category-select.component.html',
  styleUrls: ['./category-select.component.scss'],
  providers: [CUSTOM_VALUE_ACCESSOR]
})
export class CategorySelectComponent implements OnInit, ControlValueAccessor {

  categorySelected: string;
  categories: string[];
  categoryBuffer: string[];
  categoryFiltered: string[];

  doSearchSubject: Subject<any>;

  private bufferSize = 50;
  private itemBeforeFetchingMore = 10;
  loading = false;

  constructor(private categoryService: CategoryService) {
    this.categories = [];
    this.categoryBuffer = [];
    this.categoryFiltered = [];

    this.doSearchSubject = new Subject<any>();
    this.doSearchSubject.subscribe(a => {
      this.categoryBuffer = [];
      this.categoryFiltered = [];

      if (a) {
        const termReg = new RegExp(`^(${a})`, 'i');
        const filtered = this.categories.filter(cat => termReg.test(cat));
        if (filtered && filtered.length > 0) {
          this.categoryFiltered = [...filtered];
        }
      } else {
        this.categoryFiltered = [...this.categories];
      }

      setTimeout(() => this.updateBuffer(), 0);
    });
  }

  private updateBuffer() {
    this.categoryBuffer = this.categoryFiltered.slice(0, this.bufferSize);
  }

  fetchMore() {

    if (this.categoryBuffer.length >= this.categoryFiltered.length) {
      return;
    }

    const len = this.categoryBuffer.length;
    const more = this.categoryFiltered.slice(len, this.bufferSize + len);
    this.categoryBuffer = this.categoryBuffer.concat(more);
  }

  scroll({ end }) {
    if (this.loading) {
      return;
    }

    if (end + this.itemBeforeFetchingMore >= this.categoryBuffer.length) {
      this.fetchMore();
    }
  }

  private propagateChange = (_: any) => { };

  // Function to call when the rating changes.
  onChange = (category: string) => {
    // update the form
    this.propagateChange(category);
  }

  // Function to call when the input is touched (when a star is clicked).
  onTouched = () => { };

  // Allows Angular to update the model (rating).
  // Update the model and changes needed for the view here.
  writeValue(category: string): void {
    if (category) {
      this.categorySelected = category;
    }
  }

  // Allows Angular to register a function to call when the model (rating) changes.
  // Save the function as a property to call later here.
  registerOnChange(fn: (category: string) => void): void {
    this.propagateChange = fn;
  }

  // Allows Angular to register a function to call when the input has been touched.
  // Save the function as a property to call later here.
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  // Allows Angular to disable the input.
  setDisabledState = (isDisabled: boolean): void => { };

  ngOnInit() {
    this.categoryService.currentItems.subscribe(cats => {
      if (cats) {
        this.categories.splice(0, this.categories.length, ...cats);
        this.categoryFiltered.splice(0, this.categoryFiltered.length, ...cats);
        this.categoryBuffer = this.categories.slice(0, this.bufferSize);
      }
    });
  }

}
