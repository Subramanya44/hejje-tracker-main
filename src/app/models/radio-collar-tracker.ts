// models.ts
export interface Organization {
    id: number;
    name: string;
  }
  
  export interface Animal {
    id: number;
    picByte: string;
    name: string;
  }
  
  export interface TrackerData {
    id: number;
    unit_id: number | null;
    tag_id: number | null;
    batt: number;
    temperature: number | null;
    timestamp: number;
    imei: string;
    lat: number;
    lon: number;
    dop: number | null;
    speed: number | null;
    satellites: number | null;
    log_interval: string;
    colorCode: string | null;
    gpgga: string;
    log: number;
    organization: Organization;
    tagId: string;
    animalName: string;
    rangeName: string;
    trackerId: number;
    animal: Animal;
    trackerName: string;
  }
  
  export interface ApiResponse {
    responseData: TrackerData[];
  }
  