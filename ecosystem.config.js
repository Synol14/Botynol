module.exports = {
  apps : [{
    script: 'src/index.js',
    watch: '.'
  }],

  deploy : {
    production : {
      user : 'pi',
      host : '192.168.1.148',
      ref  : 'origin/main',
      repo : 'git@github.com:Synol14/Botynol.git',
      path : '/home/pi/botynol',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    } 
  }
};
