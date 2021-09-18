export interface WidgetEvent {
  type: string;
  payload: unknown;
}

export type Emit = (event: WidgetEvent) => void;
