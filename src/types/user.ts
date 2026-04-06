export interface Location {
  city: string;
  state: string;
  country: string;
}

export interface Photos {
  full: string;
  avatar: string;
}

export interface Siblings {
  brothers: number;
  sisters: number;
}

export interface Family {
  fatherProfession: string;
  motherProfession: string;
  siblings: Siblings;
  financialStatus: string;
  familyType: string;
  nativePlace: string;
  parentsContact: string;
}

export interface Contact {
  email: string;
  phone: string;
}

export interface Verified {
  id: boolean;
  selfie: boolean;
}

export interface User {
  id: string;
  displayId: string;
  name: string;
  gender: 'male' | 'female' | string;
  birthDate: string;
  age: number;
  maritalStatus: string;
  profileManagedBy: string;
  aboutMe: string;
  photos: Photos;
  isOnline: boolean;
  lastActive: string;
  badges: string[];
  location: Location;
  religion: string;
  community: string;
  motherTongue: string;
  diet: string;
  horoscopeSign: string;
  profession: string;
  companyName: string;
  annualIncome: string;
  highestQualification: string;
  educationField: string;
  collegeName: string;
  family: Family;
  contact: Contact;
  astroMatchScore: number;
  verified: Verified;
  heightCm: number;
  distanceKm: number;
  createdAt: string;
  updatedAt: string;
  isPremium: boolean;
}
