import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import React from "react"

export interface InputWithButtonProps {
  inputDisabled: boolean
  inputValue: string
  buttonText: string
  buttonOnClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
}

export function InputWithButton({
  inputDisabled,
  inputValue,
  buttonText,
  buttonOnClick,
}: InputWithButtonProps) {
  return (
    <div className="flex w-full max-w-sm items-center space-x-2">
      <Input
        disabled={inputDisabled}
        type="text"
        placeholder="Email"
        value={inputValue}
      />
      <Button onClick={buttonOnClick}>{buttonText}</Button>
    </div>
  )
}
