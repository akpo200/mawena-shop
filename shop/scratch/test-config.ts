import { Categories } from './collections/Categories';
import { buildConfig } from 'payload';

try {
  console.log('Testing Categories collection...');
  console.log('Slug:', Categories.slug);
  console.log('Fields:', Categories.fields.length);
  
  console.log('Testing buildConfig...');
  // Minimal config to test
  const config = {
    collections: [Categories],
    secret: 'test',
  };
  // @ts-ignore
  buildConfig(config);
  console.log('Config build successful!');
} catch (error) {
  console.error('Error building config:', error);
  process.exit(1);
}
