export const fetchProfiles = async () => {
  return await (
    await fetch('https://raw.githubusercontent.com/lcnetdev/bfe-profiles/main/profile-prod/data.json')
  ).json();
};
