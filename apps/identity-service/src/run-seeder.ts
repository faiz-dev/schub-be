import { seeder } from 'nestjs-seeder';
import { SeederModule } from './seeder/seeder.module';
import { UsersSeeder } from './seeder';

seeder({
  imports: [SeederModule],
}).run([UsersSeeder]);

