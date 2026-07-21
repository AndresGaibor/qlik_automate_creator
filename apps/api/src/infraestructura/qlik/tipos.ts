export interface EspacioQlik {
  id: string;
  name: string;
  type: "shared" | "personal" | "data";
  owner: { id: string; name: string };
  createdDate: string;
  modifiedDate: string;
}

export interface FlujoQlik {
  id: string;
  name: string;
  spaceId?: string;
  owner: { id: string; name: string };
  createdDate: string;
  modifiedDate: string;
  artifact: {
    id: string;
    name: string;
  };
}

export interface AutomatizacionQlik {
  id: string;
  name: string;
  spaceId?: string;
  owner: { id: string; name: string };
  isEnabled: boolean;
  triggerType: string;
  lastExecution?: {
    id: string;
    status: string;
    startTime: string;
    endTime?: string;
  };
  createdDate: string;
  modifiedDate: string;
}

export interface EjecucionQlik {
  id: string;
  automationId: string;
  status: "started" | "completed" | "failed" | "cancelled";
  startTime: string;
  endTime?: string;
  error?: string;
}
