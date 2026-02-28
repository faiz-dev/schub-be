import { seeder } from 'nestjs-seeder';
import { SeederModule } from './seeder/seeder.module';
import { AcademicSeeder } from './seeder';

seeder({
  imports: [SeederModule],
}).run([AcademicSeeder]);

