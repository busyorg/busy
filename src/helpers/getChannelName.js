export default function getChannelName(auth, otherUsername) {
  if (!auth.user) return '';
  return [
    `@${auth.user.name}`,
    `@${otherUsername}`,
  ];
}
