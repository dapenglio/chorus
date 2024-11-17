module.exports = {
  apps: [
    {
      name: 'ui',
      script: 'pnpm pokemon-ui:serve',
      instance: 1,
    },
    {
      name: 'server',
      script: 'pnpm pokemon-user-backend:serve',
      // watch: ['packages/pokemon-user-backend/src'],
      instance: 1,
    },
  ],
};
