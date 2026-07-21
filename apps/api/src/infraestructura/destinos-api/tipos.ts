export interface Database {
  name: string;
}

export interface Tabla {
  name: string;
}

export interface Columna {
  name: string;
  type: string;
}

export interface DestinoImpala {
  database: string;
  table: string;
  columns: Columna[];
  schemaSpec: string;
}

export interface DataflowRemoto {
  dataflow_id: string;
  app_id: string;
  dataflow_name: string;
  description: string;
  target_type: string;
  target_id: string;
  target_label: string;
  filename: string;
  extension: string;
  format: string;
  treat_as_relative: boolean;
}
