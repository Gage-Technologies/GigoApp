
import base64ArrayBuffer from "./arrayBufferToBase64";
import JSZip from "jszip";

const generateUniqueAlphaNumericString = (): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let result = '';

  for (let i = 0; i < 36; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    result += characters.charAt(randomIndex);
  }

  return result;
};

async function chunkFile(
  uri: string,
  file: File| Blob,
  params: RequestInit,
  completionCallback: null | ((res: any) => void) = null
) {
  // exit if no file was passed
  if (!file) {

    return;
  }

  // create new file reader
  const reader = new FileReader();

  // define chunk size 8MB
  const chunkSize = 8 * 1024 * 1024;

  // save file size
  const fileSize = file.size;

  // calculate the total chunks
  const totalChunks = Math.ceil(fileSize / chunkSize);

  // create variable to hold response object
  let res;

  // define part count
  // eslint-disable-next-line
  let partCount = 1;

  // create variable to hold reader offset
  let offset = 0;

  // create index tracker
  let partIndex = 1;

  // calculate end of file chunk
  let endOffset = Math.min(offset + chunkSize, fileSize);

  // create temporary id for upload session
  const tempFileId = generateUniqueAlphaNumericString();

  // assign upload parameters to the arguments object
  let body: any = {};
  if (params.body !== null && params.body !== undefined) {
    body = JSON.parse(params.body.toString());
  }
  Object.assign(body, { total_parts: totalChunks, upload_id: tempFileId });

  // specify reader callback to send upload chunks to the server
  reader.onload = async () => {
    // increment the part count
    partCount++;

    // set offset value to the end of the last file chunk
    offset = endOffset;

    // calculate new end offset for this file chunk
    endOffset = Math.min(offset + chunkSize, fileSize);

    // deep copy body
    let payload = JSON.parse(JSON.stringify(body));

    // set the part argument to inform the server of which chunk this is
    payload["part"] = partIndex;

    // add chunk to body
    payload["chunk"] = base64ArrayBuffer(reader.result);

    // update params with new body
    params.body = JSON.stringify(payload);

    // execute api call with the passed chunk
    res = await fetch(uri,params).then(response => response.json());

    // handle final chunk logic
    if (offset === fileSize) {
      if (completionCallback !== null) {
        completionCallback(res);
      }
      // exit on completion
      return;
    }

    // increment part index
    partIndex++;

    // execute the reader recursively for the next chunk
    await reader.readAsArrayBuffer(file.slice(offset, endOffset));
  };

  // create callback for reader errors
  reader.onerror = () => {
  };



  // execute recursive file chunk reader
  await reader.readAsArrayBuffer(file.slice(offset, endOffset));

  // alert User to the upload start
  // if (sessionStorage.getItem("alive") === "true")
  //   swal(
  //     "File Upload Is Starting. You can continue to navigate the site as normal." +
  //     " You will be notified when the upload is complete. Do not close the page if " +
  //     "the loading icon in the top right corner is moving."
  //   );

  // return start message
  return { message: "File Upload Starting" };
}

export default async function fetchWithUpload(
  uri: string,
  file: File| Blob | File[],
  params: RequestInit,
  completionCallback: null | ((res: any) => void) = null
) {
  // handle a single file
  if (Array.isArray(file) === true) {
    // create a new zipper object
    let zip = new JSZip();
    // iterate over files adding them to the zip
    for (let i = 0; i < file.length; i++) {
      // add file to zip
      zip.file(file[i].name, file[i]);
    }

    let result = null;

    // execute zip operation and pipe data to file upload
    await zip.generateAsync({ type: "blob" }).then(async function (content: Blob) {
      result = await chunkFile(
        uri,
        content,
        params,
        completionCallback
      );
    });

    return result;
  } else {
    // execute call via file chunker
    return await chunkFile(
      uri,
      file,
      params,
      completionCallback
    );
  }
}