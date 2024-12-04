import { getSheetData } from '../src/lib/google-sheets';

async function main() {
  const movies = await getSheetData();
  console.log('Validated movie data:', movies);
  
  // Movies will be type-safe with this shape:
  // { title: string; year: number; }[]
}

main().catch(console.error); 