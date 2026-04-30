export interface Unit {
  id: string;
  name: string;
  floor: string;
  type: string;
  area: string;
  status: string;
  spaceId: string;
}

export interface User {
  email: string;
  role: string;
}

export interface UseSpacespotDemo {
  user: User | null;
  units: Unit[];
  token: string | null;
  error: string;
  signup: (email: string, password: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  fetchMe: () => Promise<void>;
  createDemoUnits: (spaceId: string) => Promise<void>;
  fetchUnits: (spaceId: string) => Promise<void>;
  uploadDemoFile: (file: File) => Promise<string>;
  logout: () => void;
  updateUnit: (id: string, data: Partial<Unit>) => Promise<void>;
  deleteUnit: (id: string) => Promise<void>;
}
