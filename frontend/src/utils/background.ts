const bacgroundChoice = [
"https://unsplash.com/photos/iQRKBNKyRpo/download?ixid=MnwxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjYwNjczOTg5&force=true&w=1920",
"https://unsplash.com/photos/G9i_plbfDgk/download?ixid=MnwxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjYwNjczNzk4&force=true&w=1920",
"https://unsplash.com/photos/slRYlH9ttzc/download?ixid=MnwxMjA3fDB8MXxhbGx8M3x8fHx8fDJ8fDE2NjA2NzQ2MTA&force=true&w=1920",
"https://unsplash.com/photos/asuyh-_ZX54/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8M3x8c3BhY2V8ZW58MHx8fHwxNjYwNjcyNjIw&force=true&w=1920",
"https://ct24.ceskatelevize.cz/sites/default/files/styles/node-article_16x9/public/images/2571582-quasaroutflow.png?itok=5aFC06zk"
];

export const getBackgroundImage = () => {
  return bacgroundChoice[Math.floor(Math.random() * bacgroundChoice.length)];
};
