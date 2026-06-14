export type LegalListItem = {
  label?: string;
  text: string;
};

export type LegalSection = {
  title: string;
  paragraphs?: string[];
  list?: LegalListItem[];
};

export type LegalDocument = {
  title: string;
  lastUpdated: string;
  sections: LegalSection[];
};
