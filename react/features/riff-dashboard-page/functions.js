export function maybeExtractIdFromDisplayName(displayNameMaybeWithFirebaseId) {
  if (typeof displayNameMaybeWithFirebaseId !== 'string') return {};

  let displayName = displayNameMaybeWithFirebaseId;
  let firebaseId = '';
  const separator = '|';

  if (displayNameMaybeWithFirebaseId.includes(separator)) {
      const [ uid, ...displayNameWithoutFirebase ] = displayNameMaybeWithFirebaseId.split(separator);

      displayName = displayNameWithoutFirebase.join('');
      firebaseId = `${uid}`;
  };

  const firebaseIdWithSeparator = firebaseId ? firebaseId + separator : '';
  
  return { firebaseId, displayName, firebaseIdWithSeparator };
}