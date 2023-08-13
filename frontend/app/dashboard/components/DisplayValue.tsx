import { useContext } from "react"
import {ValueContext} from '../useValue';
export default function DisplayValue() {

  const {value} = useContext(ValueContext);

  return (
    <div>this is value : {value}</div>
  )
}