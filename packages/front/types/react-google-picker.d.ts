type DOMDocument = Document

declare namespace google {
  namespace picker {
    /**
     * https://developers.google.com/picker/docs/reference#picker-builder
     */
    export class PickerBuilder {
      constructor()

      // Add a View to the navigation pane.
      addView(viewOrViewId: DocsView | DocsUploadView | ViewId): PickerBuilder

      // Add a ViewGroup to the top-level navigation pane.
      addViewGroup(viewGroup: ViewGroup): PickerBuilder

      // Construct the Picker object. The Picker object is returned.
      build(): Picker

      // Disable a picker feature.
      disableFeature(feature: Feature): PickerBuilder

      // Enable a picker feature.
      enableFeature(feature: Feature): PickerBuilder

      // Get the relay URL, used for gadgets.rpc.
      getRelayUrl(): string

      // Get the dialog title.
      getTitle(): string

      // Disable the title bar from being shown. To re-enable, call setTitle with a non-empty title or undefined.
      hideTitleBar(): PickerBuilder

      // Check if a picker Feature is enabled.
      isFeatureEnabled(feature: Feature): boolean

      // Sets the Google Drive App ID needed to allow application to access the user's files via the Google Drive API.
      setAppId(appId: string): PickerBuilder

      // Set the callback method called when the user picks and item (or items), or cancels. The callback method receives a single callback object. The structure of the callback object is described in the JSON Guide.
      setCallback(method: (result: ResponseObject) => void): PickerBuilder

      // Sets the Browser API key obtained from Google Developers Console. See the Developer's Guide for details on how to obtain the Browser API key.
      setDeveloperKey(key: string): PickerBuilder

      // Set the document.
      setDocument(document: DOMDocument): PickerBuilder

      // ISO 639 language code. If the language is not supported, en-US is used. This method provides an alternative to setting the locale at google.load() time. See the Developer's Guide for a list of supported locales.
      setLocale(locale: string): PickerBuilder

      // Sets the maximum number of items a user can pick.
      setMaxItems(max: number): PickerBuilder

      // Sets an OAuth token to use for authenticating the current user. Depending on the scope of the token, only certain views will display data. Valid scopes are Google Docs, Drive, Photos, YouTube.
      setOAuthToken(token: string): PickerBuilder

      // Sets the origin of picker dialog. The origin should be set to the window.location.protocol + '//' + window.location.host of the top-most page, if your application is running in an iframe.
      setOrigin(origin: string): PickerBuilder

      // Set the relay URL, used for gadgets.rpc.
      setRelayUrl(url: string): PickerBuilder

      // Set the list of MIME types which will be selectable. Use commas to separate MIME types if more than one is required.
      setSelectableMimeTypes(type: string): PickerBuilder

      // Set the preferred dialog size. The dialog will be auto-centered. It has a minimum size of (566,350) and a maximum size of (1051,650).
      setSize(width: number, height: number): PickerBuilder

      // Set the dialog title.
      setTitle(title: string): PickerBuilder

      // Returns the URI generated by this builder.
      toUri(): string
    }

    /**
     * https://developers.google.com/picker/docs/reference#picker.
     */
    export interface Picker {
      isVisible(): boolean
      setCallback(method: (result: ResponseObject) => void): Picker
      setRelayUrl(url: string): Picker
      setVisible(visible: boolean): Picker
      dispose(): void
    }

    /**
     * https://developers.google.com/picker/docs/results
     */
    export interface ResponseObject {
      [Response.ACTION]: Action
      [Response.DOCUMENTS]: DocumentObject[]
      [Response.PARENTS]?: ParentDocumentObject[] | undefined
      [Response.VIEW]: [
        ViewId,
        undefined,
        { query?: string | undefined; parent?: string | undefined },
      ]
    }

    export interface DocumentObject {
      [Document.ADDRESS_LINES]: string[]
      [Document.AUDIENCE]: { [key: string]: string }
      [Document.DESCRIPTION]: string
      [Document.DURATION]: any
      [Document.EMBEDDABLE_URL]: string
      [Document.ICON_URL]: string
      [Document.ID]: string
      [Document.IS_NEW]: boolean
      [Document.LAST_EDITED_UTC]: number
      [Document.LATITUDE]: any
      [Document.LONGITUDE]: any
      [Document.MIME_TYPE]: string
      [Document.NAME]: string
      [Document.PARENT_ID]: string
      [Document.PHONE_NUMBERS]: Array<{ type: string; number: any }>
      [Document.SERVICE_ID]: ServiceId
      [Document.THUMBNAILS]: DocumentThumbnailObject[]
      [Document.TYPE]: Type
      [Document.URL]: string
    }

    export interface DocumentThumbnailObject {
      [Thumbnail.URL]: string
      [Thumbnail.WIDTH]: number
      [Thumbnail.HEIGHT]: number
    }

    export interface ParentDocumentObject {
      [Document.AUDIENCE]: { [key: string]: string }
      [Document.DESCRIPTION]: string
      [Document.LAST_EDITED_UTC]: number
      [Document.MIME_TYPE]: string
      [Document.NAME]: string
      [Document.ICON_URL]: string
      [Document.ID]: string
      [Document.IS_NEW]: boolean
      [Document.SERVICE_ID]: ServiceId
      [Document.THUMBNAILS]: DocumentThumbnailObject[]
      [Document.TYPE]: Type
      [Document.URL]: string
    }

    /**
     * https://developers.google.com/picker/docs/reference#docs-upload-view.
     */
    export class DocsUploadView {
      constructor()

      // Allows the user to select a folder in Google Drive to upload to.
      setIncludeFolders(included: boolean): DocsUploadView

      // Sets the upload destination to the specified folder. This overrides `.setIncludeFolders` to false.
      setParent(parentId: string): DocsUploadView
    }

    /**
     * https://developers.google.com/picker/docs/reference#docs-view
     */
    export class DocsView {
      // Constructor. The ViewId must be one of the Google Drive views. Default is ViewId.DOCS.
      constructor(viewId?: ViewId)

      // Show folders in the view items.
      setIncludeFolders(included: boolean): DocsView

      // Allows the user to select a folder in Google Drive.
      setSelectFolderEnabled(enabled: boolean): DocsView

      // Selects which mode the view will use to display the documents.
      setMode(mode: DocsViewMode): DocsView

      // Filters the documents based on whether they are owned by the user, or shared with the user.
      setOwnedByMe(me?: boolean): DocsView

      // Sets the initial parent folder to display.
      setParent(parentId: string): DocsView

      // Filters the documents based on whether they are starred by the user.
      setStarred(starred: boolean): DocsView

      // Allows the user to select folders from Shared Drives.
      setEnableDrives(enabled: boolean): DocsView

      // Set the MIME types which will be included in the view. Use commas to separate MIME types if more than one is required.
      setMimeTypes(mimeTypes: string): DocsView

      // Allows the user to select folders from Shared team Drives.
      /** @deprecated - use setEnableDrives instead */
      setEnableTeamDrives(enabled: boolean): DocsView
    }

    /**
     * https://developers.google.com/picker/docs/reference#view-group
     */
    export class ViewGroup {
      // Constructor. A ViewGroup is a visual grouping of Views in the navigation pane. The root item of the ViewGroup itself must be View.
      constructor(viewOrId: DocsView | ViewId)

      // Add a label to this ViewGroup.
      addLabel(label: string): ViewGroup

      // Add a view to the ViewGroup. The View can be represented by a view-derived object, or simply by ViewId.
      addView(viewOrId: DocsView | ViewId): ViewGroup

      // Nest a ViewGroup within the current ViewGroup.
      addViewGroup(viewGroup: ViewGroup): ViewGroup
    }

    /**
     * https://developers.google.com/picker/docs/reference#docs-view-mode
     */
    export enum DocsViewMode {
      // Display documents in a thumbnail grid.
      GRID = "grid",
      // Display documents in a detailed list.
      LIST = "list",
    }

    /**
     * https://developers.google.com/picker/docs/reference#feature
     */
    export enum Feature {
      // Show only documents owned by the user when showing items from Google Drive.
      MINE_ONLY = "mineOnly",

      // Allow user to choose more than one item.
      MULTISELECT_ENABLED = "multiselectEnabled",

      // Hide the navigation pane. If the navigation pane is hidden, users can only select from the first view chosen.
      NAV_HIDDEN = "navHidden",

      // For photo uploads, controls whether per-photo selection (as opposed to per-album) selection is enabled.
      SIMPLE_UPLOAD_ENABLED = "simpleUploadEnabled",

      // Whether Shared Drive items should be included in results.
      SUPPORT_DRIVES = "sdr",

      // Whether Shared team Drive items should be included in results.
      /** @deprecated - use google.picker.Feature.SUPPORT_DRIVES instead */
      SUPPORT_TEAM_DRIVES = "std",
    }

    /**
     * https://developers.google.com/picker/docs/reference#view-id
     */
    export enum ViewId {
      DOCS = "all",
      DOCS_IMAGES = "docs-images",
      DOCS_IMAGES_AND_VIDEOS = "docs-images-and-videos",
      DOCS_VIDEOS = "docs-videos",
      DOCUMENTS = "documents",
      DRAWINGS = "drawings",
      FOLDERS = "folders",
      FORMS = "forms",
      /** @deprecated */
      IMAGE_SEARCH = "image-search",
      PDFS = "pdfs",
      /** @deprecated */
      PHOTO_ALBUMS = "photo-albums",
      /** @deprecated */
      PHOTO_UPLOAD = "photo-upload",
      /** @deprecated */
      PHOTOS = "photos",
      PRESENTATIONS = "presentations",
      /** @deprecated */
      RECENTLY_PICKED = "recently-picked",
      SPREADSHEETS = "spreadsheets",
      /** @deprecated */
      VIDEO_SEARCH = "video-search",
      /** @deprecated */
      WEBCAM = "webcam",
      /** @deprecated */
      YOUTUBE = "youtube",
    }

    /**
     * https://developers.google.com/picker/docs/reference#action
     */
    export enum Action {
      CANCEL = "cancel",
      PICKED = "picked",
    }

    /**
     * https://developers.google.com/picker/docs/reference#document
     */
    export enum Document {
      ADDRESS_LINES = "addressLines",
      /** @deprecated */
      AUDIENCE = "audience",
      DESCRIPTION = "description",
      DURATION = "duration",
      EMBEDDABLE_URL = "embedUrl",
      ICON_URL = "iconUrl",
      ID = "id",
      IS_NEW = "isNew",
      LAST_EDITED_UTC = "lastEditedUtc",
      LATITUDE = "latitude",
      LONGITUDE = "longitude",
      MIME_TYPE = "mimeType",
      NAME = "name",
      NUM_CHILDREN = "numChildren",
      PARENT_ID = "parentId",
      PHONE_NUMBERS = "phoneNumbers",
      SERVICE_ID = "serviceId",
      THUMBNAILS = "thumbnails",
      TYPE = "type",
      URL = "url",
    }

    /**
     * https://developers.google.com/picker/docs/reference#response
     */
    export enum Response {
      ACTION = "action",
      DOCUMENTS = "docs",
      PARENTS = "parents",
      VIEW = "viewToken",
    }

    /**
     * https://developers.google.com/picker/docs/reference#service-id
     */
    export enum ServiceId {
      DOCS = "docs",
      MAPS = "maps",
      PHOTOS = "picasa",
      SEARCH_API = "search-api",
      URL = "url",
      YOUTUBE = "youtube",
    }

    /**
     * https://developers.google.com/picker/docs/reference#thumbnail
     */
    export enum Thumbnail {
      HEIGHT = "height",
      WIDTH = "width",
      URL = "url",
    }

    /**
     * https://developers.google.com/picker/docs/reference#type
     */
    export enum Type {
      /** @deprecated */
      ALBUM = "album",
      DOCUMENT = "document",
      LOCATION = "location",
      PHOTO = "photo",
      URL = "url",
      VIDEO = "video",
    }
  }
}

declare module "react-google-picker" {
  export class PickerBuilder {
    constructor()

    // Add a View to the navigation pane.
    addView(viewOrViewId: DocsView | DocsUploadView | ViewId): PickerBuilder

    // Add a ViewGroup to the top-level navigation pane.
    addViewGroup(viewGroup: ViewGroup): PickerBuilder

    // Construct the Picker object. The Picker object is returned.
    build(): Picker

    // Disable a picker feature.
    disableFeature(feature: Feature): PickerBuilder

    // Enable a picker feature.
    enableFeature(feature: Feature): PickerBuilder

    // Get the relay URL, used for gadgets.rpc.
    getRelayUrl(): string

    // Get the dialog title.
    getTitle(): string

    // Disable the title bar from being shown. To re-enable, call setTitle with a non-empty title or undefined.
    hideTitleBar(): PickerBuilder

    // Check if a picker Feature is enabled.
    isFeatureEnabled(feature: Feature): boolean

    // Sets the Google Drive App ID needed to allow application to access the user's files via the Google Drive API.
    setAppId(appId: string): PickerBuilder

    // Set the callback method called when the user picks and item (or items), or cancels. The callback method receives a single callback object. The structure of the callback object is described in the JSON Guide.
    setCallback(method: (result: ResponseObject) => void): PickerBuilder

    // Sets the Browser API key obtained from Google Developers Console. See the Developer's Guide for details on how to obtain the Browser API key.
    setDeveloperKey(key: string): PickerBuilder

    // Set the document.
    setDocument(document: DOMDocument): PickerBuilder

    // ISO 639 language code. If the language is not supported, en-US is used. This method provides an alternative to setting the locale at google.load() time. See the Developer's Guide for a list of supported locales.
    setLocale(locale: string): PickerBuilder

    // Sets the maximum number of items a user can pick.
    setMaxItems(max: number): PickerBuilder

    // Sets an OAuth token to use for authenticating the current user. Depending on the scope of the token, only certain views will display data. Valid scopes are Google Docs, Drive, Photos, YouTube.
    setOAuthToken(token: string): PickerBuilder

    // Sets the origin of picker dialog. The origin should be set to the window.location.protocol + '//' + window.location.host of the top-most page, if your application is running in an iframe.
    setOrigin(origin: string): PickerBuilder

    // Set the relay URL, used for gadgets.rpc.
    setRelayUrl(url: string): PickerBuilder

    // Set the list of MIME types which will be selectable. Use commas to separate MIME types if more than one is required.
    setSelectableMimeTypes(type: string): PickerBuilder

    // Set the preferred dialog size. The dialog will be auto-centered. It has a minimum size of (566,350) and a maximum size of (1051,650).
    setSize(width: number, height: number): PickerBuilder

    // Set the dialog title.
    setTitle(title: string): PickerBuilder

    // Returns the URI generated by this builder.
    toUri(): string
  }

  /**
   * https://developers.google.com/picker/docs/reference#picker.
   */
  export interface Picker {
    isVisible(): boolean
    setCallback(method: (result: ResponseObject) => void): Picker
    setRelayUrl(url: string): Picker
    setVisible(visible: boolean): Picker
    dispose(): void
  }

  /**
   * https://developers.google.com/picker/docs/results
   */
  export interface ResponseObject {
    [Response.ACTION]: Action
    [Response.DOCUMENTS]: DocumentObject[]
    [Response.PARENTS]?: ParentDocumentObject[] | undefined
    [Response.VIEW]: [
      ViewId,
      undefined,
      { query?: string | undefined; parent?: string | undefined },
    ]
  }

  export interface DocumentObject {
    [Document.ADDRESS_LINES]: string[]
    [Document.AUDIENCE]: { [key: string]: string }
    [Document.DESCRIPTION]: string
    [Document.DURATION]: any
    [Document.EMBEDDABLE_URL]: string
    [Document.ICON_URL]: string
    [Document.ID]: string
    [Document.IS_NEW]: boolean
    [Document.LAST_EDITED_UTC]: number
    [Document.LATITUDE]: any
    [Document.LONGITUDE]: any
    [Document.MIME_TYPE]: string
    [Document.NAME]: string
    [Document.PARENT_ID]: string
    [Document.PHONE_NUMBERS]: Array<{ type: string; number: any }>
    [Document.SERVICE_ID]: ServiceId
    [Document.THUMBNAILS]: DocumentThumbnailObject[]
    [Document.TYPE]: Type
    [Document.URL]: string
  }

  export interface DocumentThumbnailObject {
    [Thumbnail.URL]: string
    [Thumbnail.WIDTH]: number
    [Thumbnail.HEIGHT]: number
  }

  export interface ParentDocumentObject {
    [Document.AUDIENCE]: { [key: string]: string }
    [Document.DESCRIPTION]: string
    [Document.LAST_EDITED_UTC]: number
    [Document.MIME_TYPE]: string
    [Document.NAME]: string
    [Document.ICON_URL]: string
    [Document.ID]: string
    [Document.IS_NEW]: boolean
    [Document.SERVICE_ID]: ServiceId
    [Document.THUMBNAILS]: DocumentThumbnailObject[]
    [Document.TYPE]: Type
    [Document.URL]: string
  }

  /**
   * https://developers.google.com/picker/docs/reference#docs-upload-view.
   */
  export class DocsUploadView {
    constructor()

    // Allows the user to select a folder in Google Drive to upload to.
    setIncludeFolders(included: boolean): DocsUploadView

    // Sets the upload destination to the specified folder. This overrides `.setIncludeFolders` to false.
    setParent(parentId: string): DocsUploadView
  }

  /**
   * https://developers.google.com/picker/docs/reference#docs-view
   */
  export class DocsView {
    // Constructor. The ViewId must be one of the Google Drive views. Default is ViewId.DOCS.
    constructor(viewId?: ViewId)

    // Show folders in the view items.
    setIncludeFolders(included: boolean): DocsView

    // Allows the user to select a folder in Google Drive.
    setSelectFolderEnabled(enabled: boolean): DocsView

    // Selects which mode the view will use to display the documents.
    setMode(mode: DocsViewMode): DocsView

    // Filters the documents based on whether they are owned by the user, or shared with the user.
    setOwnedByMe(me?: boolean): DocsView

    // Sets the initial parent folder to display.
    setParent(parentId: string): DocsView

    // Filters the documents based on whether they are starred by the user.
    setStarred(starred: boolean): DocsView

    // Allows the user to select folders from Shared Drives.
    setEnableDrives(enabled: boolean): DocsView

    // Set the MIME types which will be included in the view. Use commas to separate MIME types if more than one is required.
    setMimeTypes(mimeTypes: string): DocsView

    // Allows the user to select folders from Shared team Drives.
    /** @deprecated - use setEnableDrives instead */
    setEnableTeamDrives(enabled: boolean): DocsView
  }

  /**
   * https://developers.google.com/picker/docs/reference#view-group
   */
  export class ViewGroup {
    // Constructor. A ViewGroup is a visual grouping of Views in the navigation pane. The root item of the ViewGroup itself must be View.
    constructor(viewOrId: DocsView | ViewId)

    // Add a label to this ViewGroup.
    addLabel(label: string): ViewGroup

    // Add a view to the ViewGroup. The View can be represented by a view-derived object, or simply by ViewId.
    addView(viewOrId: DocsView | ViewId): ViewGroup

    // Nest a ViewGroup within the current ViewGroup.
    addViewGroup(viewGroup: ViewGroup): ViewGroup
  }

  /**
   * https://developers.google.com/picker/docs/reference#docs-view-mode
   */
  export enum DocsViewMode {
    // Display documents in a thumbnail grid.
    GRID = "grid",
    // Display documents in a detailed list.
    LIST = "list",
  }

  /**
   * https://developers.google.com/picker/docs/reference#feature
   */
  export enum Feature {
    // Show only documents owned by the user when showing items from Google Drive.
    MINE_ONLY = "mineOnly",

    // Allow user to choose more than one item.
    MULTISELECT_ENABLED = "multiselectEnabled",

    // Hide the navigation pane. If the navigation pane is hidden, users can only select from the first view chosen.
    NAV_HIDDEN = "navHidden",

    // For photo uploads, controls whether per-photo selection (as opposed to per-album) selection is enabled.
    SIMPLE_UPLOAD_ENABLED = "simpleUploadEnabled",

    // Whether Shared Drive items should be included in results.
    SUPPORT_DRIVES = "sdr",

    // Whether Shared team Drive items should be included in results.
    /** @deprecated - use google.picker.Feature.SUPPORT_DRIVES instead */
    SUPPORT_TEAM_DRIVES = "std",
  }

  /**
   * https://developers.google.com/picker/docs/reference#view-id
   */
  export enum ViewId {
    DOCS = "all",
    DOCS_IMAGES = "docs-images",
    DOCS_IMAGES_AND_VIDEOS = "docs-images-and-videos",
    DOCS_VIDEOS = "docs-videos",
    DOCUMENTS = "documents",
    DRAWINGS = "drawings",
    FOLDERS = "folders",
    FORMS = "forms",
    /** @deprecated */
    IMAGE_SEARCH = "image-search",
    PDFS = "pdfs",
    /** @deprecated */
    PHOTO_ALBUMS = "photo-albums",
    /** @deprecated */
    PHOTO_UPLOAD = "photo-upload",
    /** @deprecated */
    PHOTOS = "photos",
    PRESENTATIONS = "presentations",
    /** @deprecated */
    RECENTLY_PICKED = "recently-picked",
    SPREADSHEETS = "spreadsheets",
    /** @deprecated */
    VIDEO_SEARCH = "video-search",
    /** @deprecated */
    WEBCAM = "webcam",
    /** @deprecated */
    YOUTUBE = "youtube",
  }

  /**
   * https://developers.google.com/picker/docs/reference#action
   */
  export enum Action {
    CANCEL = "cancel",
    PICKED = "picked",
  }

  /**
   * https://developers.google.com/picker/docs/reference#document
   */
  export enum Document {
    ADDRESS_LINES = "addressLines",
    /** @deprecated */
    AUDIENCE = "audience",
    DESCRIPTION = "description",
    DURATION = "duration",
    EMBEDDABLE_URL = "embedUrl",
    ICON_URL = "iconUrl",
    ID = "id",
    IS_NEW = "isNew",
    LAST_EDITED_UTC = "lastEditedUtc",
    LATITUDE = "latitude",
    LONGITUDE = "longitude",
    MIME_TYPE = "mimeType",
    NAME = "name",
    NUM_CHILDREN = "numChildren",
    PARENT_ID = "parentId",
    PHONE_NUMBERS = "phoneNumbers",
    SERVICE_ID = "serviceId",
    THUMBNAILS = "thumbnails",
    TYPE = "type",
    URL = "url",
  }

  /**
   * https://developers.google.com/picker/docs/reference#response
   */
  export enum Response {
    ACTION = "action",
    DOCUMENTS = "docs",
    PARENTS = "parents",
    VIEW = "viewToken",
  }

  /**
   * https://developers.google.com/picker/docs/reference#service-id
   */
  export enum ServiceId {
    DOCS = "docs",
    MAPS = "maps",
    PHOTOS = "picasa",
    SEARCH_API = "search-api",
    URL = "url",
    YOUTUBE = "youtube",
  }

  /**
   * https://developers.google.com/picker/docs/reference#thumbnail
   */
  export enum Thumbnail {
    HEIGHT = "height",
    WIDTH = "width",
    URL = "url",
  }

  /**
   * https://developers.google.com/picker/docs/reference#type
   */
  export enum Type {
    /** @deprecated */
    ALBUM = "album",
    DOCUMENT = "document",
    LOCATION = "location",
    PHOTO = "photo",
    URL = "url",
    VIDEO = "video",
  }

  interface GooglePickerProps {
    clientId: string
    developerKey: string
    scope?: string[]
    onChange?(result: ResponseObject): void
    onAuthFailed?(data: ResponseObject): void
    multiselect?: boolean
    navHidden?: boolean
    authImmediate?: boolean
    viewId?: ViewId
    mimeTypes?: string[]
    createPicker?(google: google, oauthToken: string): void
  }

  export default class GooglePicker extends React.Component<GooglePickerProps> {
    constructor(props: GooglePickerProps): void
  }

  export type Google = typeof google
}
