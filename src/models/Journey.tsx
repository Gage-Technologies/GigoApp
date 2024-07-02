export interface Task {
  _id: string;
  name: string;
  description: string;
  lang: string;
  journey_unit_id: string;
  node_above: string | null;
  node_below: string | null;
  completed: boolean;
  code_source_id: string | null;
  inProgress: boolean;
}

export interface Unit {
  _id: string;
  name: string;
  unit_above: string | null;
  unit_below: string | null;
  description: string;
  langs: string[];
  tags: string[];
  published: boolean;
  color: string;
  tasks: Task[];
  handout: string;
}
