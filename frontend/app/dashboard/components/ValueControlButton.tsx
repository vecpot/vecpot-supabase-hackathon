import { Button } from "@/components/ui/button"
import { useValueState } from "../useValue";


interface PropsType {
  type: "INC" | "DEC";
}


export default function ValueControlButton({type}: PropsType) {

  const {value, setValue} = useValueState();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault;
    if (type === "INC") {
      setValue(value + 1);
    } else {
      setValue(value - 1);
    }
  }

  return (
    <div>
      current Value : {value}
      <Button onClick={handleClick} size={"sm"}>{type}</Button>
    </div>
  )
}