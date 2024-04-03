function main(): void {
  const properties: GoogleAppsScript.Properties.Properties =
    PropertiesService.getScriptProperties();
  const folderId: string | null = properties.getProperty("FOLDER_ID");
  if (folderId === null) return;
  const folder: GoogleAppsScript.Drive.Folder =
    DriveApp.getFolderById(folderId);
  const files: GoogleAppsScript.Drive.FileIterator = folder.getFiles();
  const resource: { [key: string]: string } = {
    name: "tmp",
    mimeType: MimeType.GOOGLE_DOCS,
  };
  const option: { [key: string]: any } = {
    convert: true,
    ocr: true,
    ocrLanguage: "ja",
  };

  while (files.hasNext()) {
    const file: GoogleAppsScript.Drive.File = files.next();
    const fileName: string = file.getName();
    const fileId: string = file.getId();
    const mimeType: string = file.getMimeType();

    if (mimeType !== "application/pdf" && !mimeType.startsWith("image/")) {
      continue;
    }
    const copy: GoogleAppsScript.Drive.Schema.File | undefined =
      Drive.Files?.copy(resource, fileId, option);
    if (copy === undefined || copy.id === undefined) continue;
    const result: string = DocumentApp.openById(copy.id).getBody().getText();
    Drive.Files?.remove(copy.id);
    Logger.log(fileName);
    Logger.log(result);
  }
}
