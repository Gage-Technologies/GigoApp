export default interface JourneyUnit {
  _id: string;
  name: string;
  unit_above: string | null;
  unit_below: string;
  description: string | null;
  langs: string[];
  tags: string[];
  published: boolean;
  color: string;
  handout: string;
}
