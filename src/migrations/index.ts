import * as migration_20260505_035723 from './20260505_035723';

export const migrations = [
  {
    up: migration_20260505_035723.up,
    down: migration_20260505_035723.down,
    name: '20260505_035723'
  },
];
