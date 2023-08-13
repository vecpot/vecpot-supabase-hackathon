import { createContext, useContext, useState } from "react";

type ValueContextType = {
  value: number;
  setValue: (targetValue: number) => void;
}

export const ValueContext = createContext<ValueContextType>({
  value: 1,
  setValue: () => {}
});

type ValueContextProviderProps = {
  children: React.ReactNode;
}

export function ValueContextProvider({children}: ValueContextProviderProps) {

  const [value, setValue] = useState<number>(1);

  return (
    <ValueContext.Provider value={{
      value,
      setValue
    }}>
      {children}
    </ValueContext.Provider>
  )
}

export function useValueState() {
  const {value, setValue} = useContext(ValueContext);

  return {value, setValue}
}