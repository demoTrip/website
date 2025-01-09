import { Input } from "antd"

const NameInput = (props:React.ComponentProps<typeof Input>)=>{
  const {value, onChange, ...left} = props
  const triggerChange = (e: { target: { value: any; }; })=>{
    if(!e) return
    const v = e.target.value;
    // 限制输入的内容,只能是英文，并且将英文转换成大写
    const reg = /^[a-zA-Z]*$/;
    if (reg.test(v)) {
      onChange?.(v.toUpperCase());
    }
  }

  return (
    <Input value={value} onChange={triggerChange} {...left}/>
  )
}
export default NameInput