export interface SupportOfficer {
  name: string;
  title: string;
  phone: string;
  tel: string;
}

export interface BrandData {
  name: string;
  fullName: string;
  kioskTitle: string;
  slogan: string;
  logoUrl: string;
  hotline: string;
  supportOfficer: SupportOfficer;
}

export interface NavigationItem {
  id: string;
  label: string;
  title: string;
  desc: string;
  icon: string;
}

export interface FaqStep {
  step: number;
  title: string;
  content: string;
  imageUrl: string;
}

export interface FaqTopic {
  id: string;
  title: string;
  shortTitle: string;
  desc: string;
  icon: string;
  videoUrl: string;
  videoYoutubeId?: string;
  steps: FaqStep[];
}

export interface FaqSectionData {
  question: string;
  promptText: string;
  feedbackQuestion: string;
  feedbackPositive: string;
  feedbackNegative: string;
  feedbackNegativeResponse: string;
  backToMenuText: string;
  endConversationText: string;
  endConversationResponse: string;
  faqOfficer?: SupportOfficer;
  topics: FaqTopic[];
}

export interface StoreLink {
  storeName: string;
  url: string;
  qrUrl: string;
}

export interface AppDownloadData {
  title: string;
  subtitle: string;
  ios: StoreLink;
  android: StoreLink;
  features: Array<{ title: string; desc: string }>;
}

export interface GameData {
  title: string;
  targetScore: number;
  rewardText: string;
  description: string;
  instructions: string;
  winTitle: string;
  winSubtitle: string;
  voucherGuide: string;
  encouragements: {
    under5: string;
    '5to9': string;
    '10to14': string;
    '15to19': string;
    at20: string;
  };
  loseTitle: string;
  loseEncouragement: string;
}

export interface TermOption {
  months: number;
  label: string;
  rate: number;
}

export interface DepositCalculatorData {
  title: string;
  subtitle: string;
  minAmount: number;
  errorAmount: string;
  errorTerm: string;
  errorRate: string;
  videoGuideUrl: string;
  termOptions: TermOption[];
}

export interface LoanCycle {
  id: string;
  name: string;
  divider: number;
  stepMonths: number;
}

export interface LoanCalculatorData {
  title: string;
  subtitle: string;
  principles: string[];
  cycles: LoanCycle[];
}

export interface ProductItem {
  id: string;
  category: string;
  categoryLabel: string;
  title: string;
  tag: string;
  desc: string;
  posterUrl: string;
  benefits: string[];
}

export interface FeaturedProductsData {
  title: string;
  description: string;
  interestPopup: {
    title: string;
    message: string;
    contactPerson: string;
  };
  categories: Array<{ id: string; label: string }>;
  items: ProductItem[];
}

export interface Office {
  stt: number;
  name: string;
  type: string;
  address: string;
  phone: string;
  tel: string;
  imageUrl: string;
  googleMapsUrl: string;
}

export interface Branch {
  id: string;
  name: string;
  province: string;
  offices: Office[];
}

export interface BranchLocatorData {
  title: string;
  subtitle: string;
  workingHours: {
    weekdays: string;
    weekend: string;
  };
  branches: Branch[];
}

export interface ContentData {
  brand: BrandData;
  navigation: NavigationItem[];
  faqSection: FaqSectionData;
  appDownload: AppDownloadData;
  game: GameData;
  depositCalculator: DepositCalculatorData;
  loanCalculator: LoanCalculatorData;
  featuredProducts: FeaturedProductsData;
  branchLocator: BranchLocatorData;
}
