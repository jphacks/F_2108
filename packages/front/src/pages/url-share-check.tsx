import UrlShare from "@components/organisms/urlShare"

const UrlShareCheck: React.VFC = () => {
  return (
    <UrlShare
      file={{
        id: "string",
        author: {
          id: "qwerty",
          name: "joen doe",
          iconUrl: "http://example.com/icon/qwerty.png",
        },
        name: "filename",
        postedAt: "2019-08-24T14:15:22Z",
        url: "http://example.com",
        thumbnail: "http://example.com",
      }}
    />
  )
}

export default UrlShareCheck
