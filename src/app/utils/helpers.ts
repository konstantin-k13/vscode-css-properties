import * as css from 'css';
const regex = /[*]{2}[^*]*[^\/]*/mi;

export const getCommentType = (comment: css.Comment) => {
  const { comment: message } = comment;
  if (message) {
    if (regex.test(`/*${message}*/`)) {
      return 'doc';
    }
  }
  return 'default';
};