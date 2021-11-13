import React from "react"
import { Search } from "react-feather"

export type SearchInputProps = {
  setter: (inputValue: string) => void
  value: string
}
export const SearchInput: React.VFC<SearchInputProps> = ({ setter, value }) => {
  const handleValueChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const inputValue = event.target.value
    setter(inputValue)
  }
  return (
    <label className="flex items-center py-0.5 px-3 mx-auto text-white w-full focus-within:bg-white/20 bg-white/10 rounded-lg h-full">
      <div className="mr-4">
        <Search size={16} />
      </div>
      <input
        className="w-full bg-transparent focus:outline-none"
        name="search"
        value={value}
        onChange={handleValueChange}
        placeholder="検索"
      />
    </label>
  )
}
