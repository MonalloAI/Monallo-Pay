module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/staking/delegationListByAddress',
        destination: 'https://scan.imuachain.io/browser-server/staking/delegationListByAddress',
      },
      {
        source: '/api/staking/aliveStakingList',
        destination: 'https://scan.imuachain.io/browser-server/staking/aliveStakingList',
      },
      {
        source: '/api/staking/stakingDetails',
        destination: 'https://scan.imuachain.io/browser-server/staking/stakingDetails',
      },
      {
        source: '/api/address/details',
        destination: 'https://scan.imuachain.io/browser-server/address/details',
      }
    ];
  },
  images: {
    domains: ['s3.amazonaws.com'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}; 