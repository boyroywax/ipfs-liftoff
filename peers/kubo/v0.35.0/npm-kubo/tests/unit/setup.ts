import * as dotenv from 'dotenv';
import * as path from 'path';

const envPath = path.resolve(__dirname, 'test.env');

dotenv.config({ path:envPath });
