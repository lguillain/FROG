// @flow

import resizeImg from '@houshuang/resize-img';
import { uuid } from 'frog-utils';

import { DEFAULT_COMMENT_VALUE } from '.';

const uploadBufferWithThumbnail = (
  imageBuffer,
  imageId,
  logger,
  dataFn,
  stream,
  uploadFn,
  type
) => {
  logger({ type, itemId: imageId });

  // upload a thumbnail
  resizeImg(imageBuffer, { width: 128 }).then(buffer => {
    const blob = new Blob([buffer], { type: 'image/jpeg' });
    uploadFn(blob, imageId + 'thumb').then(url => {
      dataFn.objInsert(url, [imageId, 'thumbnail']);
      stream(url, [imageId, 'thumbnail']);
    });
  });

  // upload a bigger picture
  resizeImg(imageBuffer, { width: 800 }).then(buffer => {
    const blob = new Blob([buffer], { type: 'image/jpeg' });
    uploadFn(blob, imageId).then(url => {
      dataFn.objInsert(url, [imageId, 'url']);
      stream(url, [imageId, 'url']);
    });
  });
};

export default (
  file: any,
  logger: Function,
  dataFn: Object,
  stream: Function,
  uploadFn: Function,
  type: string
) => {
  const fr = new FileReader();

  const imageId = uuid();
  dataFn.objInsert(
    { votes: {}, comment: DEFAULT_COMMENT_VALUE, key: imageId },
    imageId
  );
  stream(imageId, [imageId, 'key']);

  fr.onloadend = loaded => {
    const imageBuffer = Buffer.from(loaded.currentTarget.result);
    uploadBufferWithThumbnail(
      imageBuffer,
      imageId,
      logger,
      dataFn,
      stream,
      uploadFn,
      type
    );
  };
  fr.readAsArrayBuffer(file);
};
