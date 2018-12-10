export const defaultEmailMessage = {
  from_email: 'donotreply@evolvemusic.org',
  from_name: 'HOME',
  headers: { 'Reply-To': 'info@helpingmusic.org' },
  inline_css: true,
  merge: true,
  merge_language: 'handlebars',
  global_merge_vars: [
    { name: 'homeurl', content: 'https://my.evolvemusic.org' },
    { name: 'name', content: 'Homie' },
  ],
};
