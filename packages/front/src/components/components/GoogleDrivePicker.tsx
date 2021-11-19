/* eslint-disable */

import React from "react"
import GooglePicker from "react-google-picker"
import type { Google, ResponseObject } from "react-google-picker"
import { convertBinaryToFile } from "@lib/convertBinaryToFile"

export type GoogleDrivePickerProps = {
  children: React.ReactNode
  onChange: (data: { file: File; name: string }) => void
}

const GoogleDrivePicker: React.VFC<GoogleDrivePickerProps> = ({
  children,
  onChange,
}) => {
  //Google DriveからPDFを追加する
  const filePickerCallback = async (google: Google, data: ResponseObject) => {
    if (data[google.picker.Response.ACTION] === google.picker.Action.PICKED) {
      const doc = data.docs[0]
      if (doc == null || doc.mimeType !== "application/pdf") {
        return
      }
      // TODO: windowオブジェクトを参照するのをやめたい
      // @ts-ignore
      window.gapi.load("client:auth2", () => {
        // @ts-ignore
        window.gapi.client.load("drive", "v3", async () => {
          // @ts-ignore
          const res = await window.gapi.client.drive.files.get({
            fileId: doc.id,
            alt: "media",
            fields: "webContentLink",
          })
          const file = convertBinaryToFile(res.body, doc.name, doc.mimeType)
          onChange({ file, name: doc.name })
        })
      })
    }
  }

  return (
    <GooglePicker
      clientId={process.env.NEXT_PUBLIC_AUTH_CLIENT_ID ?? ""}
      developerKey={process.env.NEXT_PUBLIC_AUTH_CLIENT_SECRET ?? ""}
      scope={["https://www.googleapis.com/auth/userinfo.email"]}
      onChange={(data) => console.log("on change:", data)}
      onAuthFailed={(data) => console.log("on auth failed:", data)}
      multiselect={true}
      navHidden={true}
      authImmediate={false}
      mimeTypes={["application/pdf"]}
      createPicker={(google, oauthToken) => {
        const googleViewId = google.picker.ViewId.PDFS
        const docsView = new google.picker.DocsView(googleViewId).setMimeTypes(
          "application/pdf",
        )

        const picker = new window.google.picker.PickerBuilder()
          .addView(docsView)
          .setOAuthToken(oauthToken)
          .setAppId("617186840368")
          .setDeveloperKey(process.env.NEXT_PUBLIC_AUTH_CLIENT_SECRET ?? "")
          .setLocale("ja")
          .setSelectableMimeTypes("application/pdf")
          .setCallback((data) => filePickerCallback(google, data))
        picker.build().setVisible(true)
      }}
    >
      {children}
      <div className="google" />
    </GooglePicker>
  )
}

export default GoogleDrivePicker
