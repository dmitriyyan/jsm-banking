export type Account = {
  id: string;
  availableBalance: number;
  currentBalance: number;
  officialName: string;
  mask: string;
  institutionId: string;
  name: string;
  type: AccountTypes;
  subtype: string;
  appwriteItemId: string;
  shareableId: string;
};

export type AccountTypes =
  | 'depository'
  | 'credit'
  | 'loan '
  | 'investment'
  | 'other';