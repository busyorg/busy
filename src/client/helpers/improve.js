const latexRegex = /\[\+\]((\n|.)*?)\[\+\]/g;

export default function improve(body) {
  return body.replace(
    latexRegex,
    (match, p1) => `![${p1}](https://latex.codecogs.com/gif.latex?${encodeURI(p1)})`,
  );
}
