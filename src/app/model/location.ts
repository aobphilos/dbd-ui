export class SubDistrict {
  constructor(
    public name: string,
    public postalCode: string,
    public locationCode: string
  ) { }
}

export class District {
  constructor(
    public name: string,
    public subDistricts: SubDistrict[]
  ) { }
}

export class Province {
  constructor(
    public name: string,
    public districts: District[]
  ) { }
}
