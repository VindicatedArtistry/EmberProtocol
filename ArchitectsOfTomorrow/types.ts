export enum AppState {
  Welcome,
  PathSelection,
  InitialQuestions,
  GeneratingDeepDive,
  DeepDiveQuestions,
  GeneratingCodex,
  CodexDisplay,
  SoulSeedDisplay,
  Activated,
  Error,
}

export interface Question {
  section: string;
  text: string;
  type?: 'multichoice' | 'text';
  options?: string[];
  followUp?: string;
}

export type Answers = Record<string, string>;

export interface Example {
  author: string;
  quote: string;
}

export type UserPath = 'engineer' | 'artist';