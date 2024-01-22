export type Note = {
  id: string;
  title: string;
  content: string;
  updatedat: string;
};

export type Version = {
  id: string;
  note_id: string;
  colname: string;
  oldval: string;
  newval: string;
  timestamp: string;
}