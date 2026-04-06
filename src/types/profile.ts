export interface Profile {
  id: string;
  displayId: string;
  name: string;
  gender: string;
  birthDate: string;
  age: number;
  maritalStatus: string;
  profileManagedBy: string;
  aboutMe: string;
  photos: {
    full: string;
    avatar: string;
  };
  isOnline: boolean;
  lastActive: string;
  badges: string[];
  location: {
    city: string;
    state: string;
    country: string;
  };
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
  family: {
    fatherProfession: string;
    motherProfession: string;
    siblings: {
      brothers: number;
      sisters: number;
    };
    financialStatus: string;
    familyType: string;
    nativePlace: string;
    parentsContact: string;
  };
  contact: {
    email: string;
    phone: string;
  };
  astroMatchScore: number;
  verified: {
    id: boolean;
    selfie: boolean;
  };
  heightCm: number;
  distanceKm: number;
  createdAt: string;
  updatedAt: string;
  isPremium: boolean;
}
