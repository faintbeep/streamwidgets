import { Emit } from "../../types";

export default async function setup(emit: Emit): Promise<() => void> {
  const interval = setInterval(() => emit({ type: 'Clock', payload: new Date() }), 1000);
  
  return () => {
    clearInterval(interval);
  };
}
