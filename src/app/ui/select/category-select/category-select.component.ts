import { Component, OnInit, forwardRef } from '@angular/core';
import { CategoryService } from '../../../core/category.service';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

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

  private bufferSize = 50;
  private itemBeforeFetchingMore = 10;
  loading = false;

  constructor(private categoryService: CategoryService) {
    this.categories = [];
    this.categoryBuffer = [];
  }

  fetchMore() {
    const len = this.categoryBuffer.length;
    const more = this.categories.slice(len, this.bufferSize + len);
    this.loading = true;
    // using timeout here to simulate backend API delay
    setTimeout(() => {
      this.loading = false;
      this.categoryBuffer = this.categoryBuffer.concat(more);
    }, 200);
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
    const cats = this.categoryService.currentItems;
    if (cats) {
      this.categories.splice(0, this.categories.length, ...cats);
      this.categoryBuffer = this.categories.slice(0, this.bufferSize);
    }
  }

}
