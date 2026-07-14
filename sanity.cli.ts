import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: '2su1f8zh',
    dataset: 'production',
  },
  deployment: {
    autoUpdates: true,
  },
})
