import { Component, OnInit, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { LocationService } from '../../../core/location.service';
import { Province, District, SubDistrict } from '../../../model/location';
import { Observable, of } from 'rxjs';
import { ILocationSelected } from '../../../model/interfaces/location-selected';

const CUSTOM_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => LocationSelectComponent),
  multi: true
};

@Component({
  selector: 'app-location-select',
  templateUrl: './location-select.component.html',
  styleUrls: ['./location-select.component.scss'],
  providers: [CUSTOM_VALUE_ACCESSOR]
})
export class LocationSelectComponent implements OnInit, ControlValueAccessor {

  @Input() isSearchMode: boolean;

  locationSelected: ILocationSelected;

  provinces: Observable<Province[]>;
  districts: Observable<District[]>;
  subDistricts: Observable<SubDistrict[]>;
  postalCodes: Observable<string[]>;

  constructor(private loactionService: LocationService) {
    this.locationSelected = {
      provinceSelected: null,
      districtSelected: null,
      subDistrictSelected: null,
      postalCodeSelected: null
    };
  }

  writeValue(item: ILocationSelected): void {
    if (item) {
      this.locationSelected = item;
      this.bindLocationData();
    }
  }

  registerOnChange = (fn: any): void => this.onStateChanged = fn;

  registerOnTouched = (fn: any): void => { };

  // Allows Angular to disable the input.
  setDisabledState = (isDisabled: boolean): void => { };

  onProvinceChange(item: Province) {
    this.resetBelowProvince();
    this.onStateChanged(this.locationSelected);

    if (!item) { return; }

    this.districts = of(item.districts);
  }

  onDistrictChange(item: District) {
    this.resetBelowDistrict();
    this.onStateChanged(this.locationSelected);

    if (!item) { return; }

    this.subDistricts = of(item.subDistricts);

    const posts = {};
    item.subDistricts.forEach(sub => posts[sub.postalCode] = 1);
    this.postalCodes = of(Object.keys(posts));
  }

  onSubDistrictChange(item: District) {
    this.resetBelowSubDistrict();
    this.onStateChanged(this.locationSelected);
  }

  onPostalCodeChange(item: string) {
    this.onStateChanged(this.locationSelected);
  }

  private bindLocationData() {
    const province = this.locationSelected.provinceSelected;
    if (province && province !== '') {
      this.provinces.subscribe(
        provinces => {
          const foundProvince = provinces.find(e => e.name === province);
          if (foundProvince) {
            const districts = foundProvince.districts;
            this.districts = of(districts);

            const district = this.locationSelected.districtSelected;
            if (district && district !== '') {
              const foundDistrict = districts.find(e => e.name === district);
              if (foundDistrict) {
                const subDistricts = foundDistrict.subDistricts;
                this.subDistricts = of(subDistricts);

                const posts = {};
                subDistricts.forEach(sub => posts[sub.postalCode] = 1);
                this.postalCodes = of(Object.keys(posts));

              }
            }
          }
        }
      );
    }
  }

  private onStateChanged = (location: ILocationSelected) => { };

  private resetBelowProvince() {
    this.locationSelected.districtSelected = null;
    this.locationSelected.subDistrictSelected = null;
    this.locationSelected.postalCodeSelected = null;
  }

  private resetBelowDistrict() {
    this.locationSelected.subDistrictSelected = null;
    this.locationSelected.postalCodeSelected = null;
  }

  private resetBelowSubDistrict() {
    this.locationSelected.postalCodeSelected = null;
  }

  ngOnInit() {
    this.provinces = this.loactionService.currentItems;
  }

}
