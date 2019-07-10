import webpack from 'webpack';
import webpackConfig from './webpack.config';
import {cleanDir, copyDir, writeFile, isExist} from './file';
import spawn from 'cross-spawn';
import pkg from '../package.json';

const bundle = () => {
  return new Promise((resolve, reject) => {
    webpack(webpackConfig, (err, stats) => {
      if (err) {
        reject(err);
      } else if (stats.hasErrors()) {
        reject(stats.toString(webpackConfig.stats));
      } else {
        console.log(stats.toString(webpackConfig.stats));
        resolve();
      }
    });
  });
};

const createPackageJson = () => {
  return writeFile('dist/package.json', JSON.stringify({
    private: true,
    version: pkg.version,
    description: pkg.description,
    author: pkg.author,
    main: pkg.main,
    dependencies: pkg.dependencies
  }, null, 2));
};

(async () => {
  try {
    await cleanDir('dist/*', {
      nosort: true,
      dot: true,
      ignore: ['dist/node_modules']
    });
    await bundle();
    await copyDir('public', 'dist');
    await createPackageJson();
    if (!await isExist('dist/node_modules')) {
      process.chdir('dist');
      spawn.sync(
        'npm',
        ['install'],
        { stdio: 'inherit' }
      );
      process.chdir('..');
    }
    spawn.sync(
      'npm',
      ['run', 'packager'],
      { stdio: 'inherit' }
    );
  } catch (e) {
    console.error(e);
  }
})();