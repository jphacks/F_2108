import Image from "next/image"
import React from "react"

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
    <div className="pt-2 relative mx-auto text-white">
      <button type="submit" className="absolute left-0 top-0 mt-3 mr-4">
        <Image src="/search.png" width={30} height={30} />
      </button>
      <input
        className="border-b-2 border-white bg-black h-10 px-12 pr-40 text-2xl focus:outline-none"
        type="search"
        name="search"
        value={value}
        onChange={(e) => {
          handleValueChange(e)
        }}
        placeholder="検索"
      />
    </div>
  )
}
